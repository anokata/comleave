# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
import datetime

import logging
logging.basicConfig(level=logging.DEBUG, format=' %(asctime)s - %(levelname)s- %(message)s')
log = logging.getLogger('main.views')

# Create your models here.
class Person(models.Model):
    name = models.CharField(max_length=200)
    is_manager = models.BooleanField()
    login = models.CharField(max_length=200)
    email = models.CharField(max_length=200)

    def __str__(self):
        return self.login + ' # ' + self.email  + (' (+)' if self.is_manager else ' (-)')


class Overs(models.Model):
    ACCEPT = 'A'
    DENIED = 'D'
    REGISTRED = 'R'
    STATUS_CHOISES = (
        ('R', 'Registred'),
        ('D', 'Denied'),
        ('A', 'Accepted'),
    )
    KIND_CHOISES = (
            ("O", "Overwork/downwork"),
            ("I", "Ill"),
    )
    reg_date = models.DateTimeField('date registred', auto_now_add=True)
    start_date = models.DateField('start date')
    interval = models.IntegerField(default=1)
    status = models.CharField(max_length=100,
                                  choices=STATUS_CHOISES,
                                  default='R')
    comment = models.CharField(max_length=512, null=True)
    person = models.ForeignKey(Person, on_delete=models.CASCADE, null=True)
    is_over = models.BooleanField("is overwork?(else unworked)", default=False)
    kind = models.CharField(max_length=42,
                                  choices=KIND_CHOISES,
                                  default='O')

    def __str__(self):
        return self.reg_date.strftime("%Y.%m.%d") + ' ' \
                + self.get_status_display() + '  ' \
                + str(self.interval) + ' minutes ' \
                + self.person.name + ' '\
                + self.get_kind_display() + ' '\
                + ('(UP)' if self.is_over else '(DN)')

# filters: person_id, datefrom dateto, is_over
# TODO total remake
def overwork_query(status, limit=False, offset=0, person_id=-1, is_over=None,
        dateFrom=False, dateTo=False):

    query = "select overwork_person.login, overwork_overs.id, reg_date, start_date, overwork_overs.interval, comment, name, is_over, kind, overwork_person.id "\
        "from overwork_overs inner join overwork_person "\
        "on overwork_overs.person_id=overwork_person.id "
    query += over_where(status, limit, offset, person_id, is_over, dateFrom, dateTo)
    query += " order by reg_date desc"
    limit = int(limit)
    offset = int(offset)
    query += " limit %s"%(limit) if limit > 0 else ""
    query += " offset %s"%(offset) if offset > 0 else ""
    #print(query)
    querydata = Overs.objects.raw(query)
    total = overwork_count(status, person_id, is_over, dateFrom, dateTo)
    data = {
            "total": total,
            "data": [{
        'id': q.id, 
        'name':q.name, 
        'login':q.login, 
        'is_over':q.is_over, 
        'comment':q.comment,
        'kind':q.kind,
        'interval':q.interval,
        'start_date':q.start_date,
        'reg_date':q.reg_date,
        'person_id':q.person_id,
        } for q in querydata]}
    return data

def overwork_count(status, person_id=-1, is_over=None, dateFrom=False, dateTo=False):
    if not person_id != -1 and is_over == None and not dateFrom:
        return Overs.objects.filter(status=status).count()
    else: 
        return 30

def over_where(status, limit=False, offset=0, person_id=-1, is_over=None,
        dateFrom=False, dateTo=False):
    query = "where overwork_overs.status='" + status  + "' "
    if person_id != -1:
        query += " and overwork_overs.person_id = '" + str(person_id) + "' "
    if is_over != None:
        query += " and overwork_overs.is_over = " + "'1'" if is_over else "'0'"
    if dateFrom and dateTo:
        query += " and overwork_overs.start_date >= '" + dateFrom + "'"
        query += " and overwork_overs.start_date <= '" + dateTo + "'"
    return query

def summarize_query():
    q = "select oo.id, oo.name, oo.login, "\
        "coalesce((select sum(overwork_overs.interval) as ill "\
        "from overwork_overs "\
        "where status='A' AND person_id=oo.id and kind='I') , 0) as ill, "\
        "coalesce((select sum(overwork_overs.interval) as downwork "\
        "from overwork_overs "\
        "where status='A' AND is_over='0' and person_id=oo.id and kind='O') , 0) as unwork, "\
        "coalesce((select sum(overwork_overs.interval) as upwork "\
        "from overwork_overs join overwork_person on overwork_overs.person_id=overwork_person.id "\
        "where status='A' AND is_over='1' and person_id=oo.id and kind='O'), 0) as overwork "\
        "from overwork_person as oo;";
    qd = Overs.objects.raw(q)
    data = [{
        'overwork': q.overwork, 
        'name':q.name, 
        'unwork':q.unwork, 
        'ill':q.ill, 
        'login':q.login,
        'person_id':q.id,
        } for q in qd]
    return data

def summarize_query_between(start_date, end_date):
    q = "select oo.id, oo.name, oo.login, "\
        "coalesce((select sum(overwork_overs.interval) as ill "\
            "from overwork_overs "\
            "where status='A' AND person_id=oo.id and kind='I' "\
            " and start_date >= '{0}' and start_date <= '{1}') , 0) as ill, "\
        "coalesce((select sum(overwork_overs.interval) as downwork "\
            "from overwork_overs "\
            "where status='A' AND is_over='0' and person_id=oo.id and kind='O' "\
            " and start_date >= '{0}' and start_date <= '{1}') , 0) as unwork, "\
        "coalesce((select sum(overwork_overs.interval) as upwork "\
            "from overwork_overs join overwork_person on overwork_overs.person_id=overwork_person.id "\
            "where status='A' AND is_over='1' and person_id=oo.id and kind='O' "\
            " and start_date >= '{0}' and start_date <= '{1}') , 0) as overwork "\
        "from overwork_person as oo ;"
    q = q.format(start_date, end_date)
    log.debug(q)
    qd = Overs.objects.raw(q)
    data = [{
        'overwork': q.overwork, 
        'name':q.name, 
        'unwork':q.unwork, 
        'ill':q.ill, 
        'login':q.login,
        'person_id':q.id,
        } for q in qd]
    return data
