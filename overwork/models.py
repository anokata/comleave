# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

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
    reg_date = models.DateTimeField('date registred', auto_now_add=True)
    start_date = models.DateField('start date')
    interval = models.IntegerField(default=1)
    status = models.CharField(max_length=100,
                                  choices=STATUS_CHOISES,
                                  default='R')
    comment = models.CharField(max_length=512, null=True)
    person = models.ForeignKey(Person, on_delete=models.CASCADE, null=True)
    is_over = models.BooleanField("is overwork?(else unworked)", default=False)

    def __str__(self):
        return self.reg_date.strftime("%Y.%m.%d") + ' ' \
                + self.get_status_display() + '  ' \
                + str(self.interval) + ' minutes ' \
                + self.person.name + ' '\
                + ('(UP)' if self.is_over else '(DN)')

def overwork_query(status, limit=False, offset=0):
    query = "select overwork_person.login, overwork_overs.id, reg_date, start_date, overwork_overs.interval, comment, name, is_over, overwork_person.id "\
        "from overwork_overs inner join overwork_person "\
        "on overwork_overs.person_id=overwork_person.id "\
        "where overwork_overs.status='" + status + "' order by reg_date desc"
    limit = int(limit)
    offset = int(offset)
    query += " limit %s"%(limit) if limit > 0 else ""
    query += " offset %s"%(offset) if offset > 0 else ""
    querydata = Overs.objects.raw(query)
    data = {
            "total": overwork_count(status),
            "data": [{
        'id': q.id, 
        'name':q.name, 
        'login':q.login, 
        'is_over':q.is_over, 
        'comment':q.comment,
        'interval':q.interval,
        'start_date':q.start_date,
        'reg_date':q.reg_date,
        'person_id':q.person_id,
        } for q in querydata]}
    return data

def overwork_count(status):
    return Overs.objects.filter(status=status).count()

def summarize_query():
    q = "select oo.id, oo.name, oo.login, "\
        "coalesce((select sum(overwork_overs.interval) as downwork "\
        "from overwork_overs "\
        "where status='A' AND is_over='0' and person_id=oo.id ) , 0) as unwork, "\
        "coalesce((select sum(overwork_overs.interval) as upwork "\
        "from overwork_overs join overwork_person on overwork_overs.person_id=overwork_person.id "\
        "where status='A' AND is_over='1' and person_id=oo.id), 0) as overwork "\
        "from overwork_person as oo;";
    qd = Overs.objects.raw(q)
    data = [{
        'overwork': q.overwork, 
        'name':q.name, 
        'unwork':q.unwork, 
        'login':q.login,
        'person_id':q.id,
        } for q in qd]
    return data
