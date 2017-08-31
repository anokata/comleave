# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.core.mail import send_mail
from .models import Person, Overs
import logging
log = logging.getLogger('mail')

def interval2hours(i):
    return str(int(i) / 60) + ' hours ' + str(int(i) % 60) + ' minutes'

def make_mail_body(person_id, date, interval, comment, is_over):
    person = Person.objects.filter(pk=person_id).first()
    if not person: return 'no person' # Exception
    if is_over:
        body = u'Запрос переработки от ' 
    else: 
        body = u'Запрос на отгул от ' 
    body += person.name + ' на '
    body += interval2hours(interval)
    body += u' на ' + date
    body += u' \nComment:\n' + comment #TODO {} .format
    body += u'\n\nПортал отгулов и переработок \n'
    body += u'http://10.4.126.23:8005/reg\n'
    return body


def make_mail_acc_body(over, is_acc, user):
    body = ''
    body += 'Уважаемый '
    body += user.name + '\n'
    body += 'Ваша заявка '
    body += "на переработку " if over.is_over else "на отгул "

    #body += str(over.start_date) + ' ('
    #body += str(over.interval) + ' min) '
    body += "(%d" % (over.interval // 60)
    if (over.interval % 60) == 30:
        body += ' 1/2'
    body += ' hour) '

    body += "была принята " if is_acc else "была отклонена "
    body += "\nВаш комментарий:" + over.comment
    body += "\n--"
    body += "\nС уважением, Служба учёта переработок и отгулов (СУПиО)"

    return body

def mail_register_udwork(person_id, date, interval, comment, is_over):
    manager = User.objects.filter(is_staff=True).exclude(is_superuser=True).first()
    if not manager: 
        logging.error("manager not found")
        return
    mail = manager.email
    logging.debug('mail to' + mail)
    try:
        send_mail(
            'Registred overwork' if is_over else 'Registred unwork',
            make_mail_body(person_id, date, interval, comment, is_over),
            'djangomosreg@mail.ru',
            [mail],
            fail_silently=False,
        )
    except Exception as ex:
        logging.error(str(ex))

#DRY
def mail_user_udwork(over, status):
    is_acc = status == Overs.ACCEPT
    user = Person.objects.filter(pk=over.person_id).first()
    logging.debug(user)
    if not user: 
        logging.error("user not found")
        return
    mail = user.email
    logging.debug('mail to' + mail)
    try:
        send_mail(
            'Accepted ' if is_acc else 'Denied ',
            make_mail_acc_body(over, is_acc, user),
            'djangomosreg@mail.ru',
            [mail],
            fail_silently=False,
        )
    except Exception as ex:
        logging.error(str(ex))
