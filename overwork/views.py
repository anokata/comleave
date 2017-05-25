# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from __future__ import print_function
import datetime
import ldap
import uuid

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
from django.views.generic import TemplateView, View
from django.views.decorators.csrf import csrf_protect
from django.conf import settings
from django.http import JsonResponse
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import user_passes_test, login_required
from django.contrib import auth
from django.core import serializers
from django.core.mail import send_mail
from auth import ActiveDirectoryBackend

from .models import Overs, Person


import logging
logging.basicConfig(level=logging.DEBUG, format=' %(asctime)s - %(levelname)s- %(message)s')
logging.debug('Start of webapp comleave')
log = logging.getLogger('main.views')

# Login 
def ldap_login(user, password):
    print('*** ldap', user, password)
    try:
        ldap_user = ActiveDirectoryBackend(username=user,
                                           password=password).authenticate()
    except Exception as e:
        log.critical('LDAP Error: {}'.format(e))
        ldap_user = None
        return False

    log.info('Logged in AD-user: {}'.format(ldap_user['username']))
    print('ldap ***', ldap_user)
    return ldap_user


def ensure_manager_exist():
    try:
        user = User.objects.filter(username='manager').first()
        if user:
            logging.debug('manager exist. OK')
        else:
            logging.debug('manager do not exist')
            add_user('manager', password=settings.MANAGER_PWD, is_staff=True)
            logging.debug('manager created')
    except Exception as ex:
        logging.error(str(ex))
        return

def add_user(username, email='', password='', first_name='', last_name='', is_staff=False):
    user = User.objects.create_user(
            username,
            email=email,
            password=password)
    user.first_name = first_name
    user.last_name = last_name
    user.is_staff = is_staff
    user.save()
    person = Person(login=username, 
        name=first_name + ' ' + last_name,
        is_manager=is_staff,
        email=email)
    person.save()

def register_new_user(request):
    if request.method == 'POST':
        username = request.POST.get("username", "")
        password = request.POST.get("password", "")
        last_name = request.POST.get("last_name", "")
        first_name = request.POST.get("first_name", "")
        email = request.POST.get("email", "")
        if User.objects.filter(username=username).first():
            return HttpResponse('exist')

        try:
            add_user(username, email, password, first_name, last_name)
        except Exception as e:
            return HttpResponse(str(e))
        user = authenticate(request=request, username=username, password=password)
        if user is not None:
            login(request, user)
        return HttpResponse('ok')
    return HttpResponse('not')

def get_user(request):
    if request.user.is_authenticated:
        data = {
                'username': request.user.username,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'email': request.user.email,
                'is_staff': request.user.is_staff,
                'is_authenticated': True,
                }
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({
                'username': 'anonymous',
                'first_name': '',
                'last_name': '',
                'email': '',
                'is_staff': False,
                'is_authenticated': False,
            }, safe=False)


def update_current_user(request):
    if request.method == 'POST':
        try:
            last_name = request.POST.get("last_name", "")
            first_name = request.POST.get("first_name", "")
            email = request.POST.get("email", "")
            request.user.last_name = last_name
            request.user.first_name = first_name
            request.user.email = email
            request.user.save()
            person = Person.objects.filter(login=request.user.username).first()
            if person:
                person.name = first_name + ' ' + last_name
                person.email = email
                person.save()
        except Exception as e:
            return HttpResponse(str(e))
        return HttpResponse('ok')
    return HttpResponse('not')

def logout_user(request):
    auth.logout(request)
    return HttpResponse('ok')

def login_user(request):
    if request.method == 'POST':
        try:
            username = request.POST["username"]
            password = request.POST["password"]
            #ldap
            #if person not exist
            if settings.USE_LDAP and not Person.objects.filter(login=username).first():
                # try ldap login
                user = ldap_login(username, password)
                if not user:
                    return HttpResponse('not')
                # if ok then create that user
                add_user(username, user['email'], 
                        password, user['first_name'], 
                        user['last_name'])
            #ldap

            user = authenticate(request=request, username=username, password=password)
            if user is not None:
                login(request, user)
                return HttpResponse('ok')
            else:
                return HttpResponse('not')

        except Exception as e:
            return HttpResponse(str(e))
    return HttpResponse('not')

def restore(request):
    if request.method == 'POST':
        username = request.POST["username"]
        email = request.POST["email"]
        user_byname = User.objects.filter(username=username).first()
        user_bymail = User.objects.filter(email=email).first()
        if not user_bymail and not user_byname:
            return HttpResponse('not')
        else:
            pass
    return HttpResponse('not')

# Views
@csrf_protect
def main(request):
    return render(request, 'route.html', {
        'ANGULAR_URL' : settings.ANGULAR_URL,
        })

def changeStatus(over_id, status):
    over = Overs.objects.filter(pk=over_id).first()
    if over:
        if status != Overs.REGISTRED:
            mail_user_udwork(over, status)
        over.status = status
        over.save()

def user_is_staff(user):
    return user.is_authenticated and user.is_staff

@user_passes_test(user_is_staff, login_url="/accounts/login/")
def accept(request, over_id, interval):
    if int(interval) == 0:
        changeStatus(over_id, Overs.ACCEPT)
    else:
        over = Overs.objects.filter(pk=over_id).first()
        if over:
            over.interval = interval
            over.save()
        changeStatus(over_id, Overs.ACCEPT)
    return HttpResponse('ok')

@user_passes_test(user_is_staff, login_url="/accounts/login/")
def deny(request, param):
    changeStatus(param, Overs.DENIED)
    return HttpResponse(' param:' + param)

def register(request, param):
    changeStatus(param, Overs.REGISTRED)
    return HttpResponse(' param:' + param)

# util
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
    body += u' \nComment:\n' + comment
    return body


def make_mail_acc_body(over, is_acc, user):
    body = ''
    body += 'Уважаемый '
    body += user.name + '\n'
    body += 'Ваша заявка '
    body += "на переработку " if over.is_over else "на отгул "

    body += str(over.start_date) + ' ('
    body += str(over.interval) + ' min) '

    body += "была принята " if is_acc else "была отклонена "

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

@login_required
def register_overwork(request, date, interval, person_id, comment):
    logging.debug('register_overwork')
    mail_register_udwork(person_id, date, interval, comment, True)
    return register_interval(request, date, interval, person_id, comment, True)

@login_required
def register_unwork(request, date, interval, person_id, comment):
    mail_register_udwork(person_id, date, interval, comment, False)
    return register_interval(request, date, interval, person_id, comment, False)

def register_interval(request, date, interval, person_id, comment, is_over):
    person = Person.objects.filter(pk=person_id).first()
    if not person: return 'no person'
    date = datetime.datetime.strptime(date, "%d.%m.%Y")
    now = datetime.datetime.now()
    if not comment:
        comment = '-'
    over = Overs(start_date=date, reg_date=now, comment=comment, 
            interval=interval, person=person, is_over=is_over)
    over.save()
    return HttpResponse('ok')

@user_passes_test(user_is_staff, login_url="/accounts/login/")
def delete(request, over_id):
    Overs.objects.get(id=over_id).delete()
    return HttpResponse(' param:' + over_id)

def persons(request):
    persons = Person.objects.all()
    data = [{'id': p.pk, 'name':p.name, 
        'is_manager':p.is_manager, 'login':p.login} for p in persons]
    return JsonResponse(data, safe=False)

def summarize(request):
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
        'login':q.login
        } for q in qd]
    return JsonResponse(data, safe=False)

def overwork_query(status):
    query = "select overwork_overs.id, reg_date, start_date, overwork_overs.interval, comment, name, is_over, overwork_person.id "\
        "from overwork_overs inner join overwork_person "\
        "on overwork_overs.person_id=overwork_person.id "\
        "where overwork_overs.status='" + status + "' order by reg_date desc"
    querydata = Overs.objects.raw(query)
    data = [{
        'id': q.id, 
        'name':q.name, 
        'is_over':q.is_over, 
        'comment':q.comment,
        'interval':q.interval,
        'start_date':q.start_date,
        'reg_date':q.reg_date,
        'person_id':q.person_id,
        } for q in querydata]
    return data

def registred(request):
    return JsonResponse(overwork_query('R'), safe=False)

def accepted(request):
    return JsonResponse(overwork_query('A'), safe=False)

def denied(request):
    return JsonResponse(overwork_query('D'), safe=False)

ensure_manager_exist()
