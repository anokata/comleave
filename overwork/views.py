# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from __future__ import print_function
import datetime

from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect
from django.conf import settings
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import user_passes_test, login_required
from django.contrib import auth

from .models import Overs, Person, overwork_query, summarize_query
from .users import ensure_manager_exist, add_user, ldap_login
from .mail import *

import logging
logging.basicConfig(level=logging.DEBUG, format=' %(asctime)s - %(levelname)s- %(message)s')
logging.debug('Start of webapp comleave')
log = logging.getLogger('main.views')

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
            add_user(username, email, password, first_name=first_name, last_name=last_name)
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
                'first_name': 'Пользователь',
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
                        password, first_name=user['first_name'], 
                        last_name=user['last_name'])
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

def over_by_id(request, id):
    over = Overs.objects.filter(pk=id).first()
    if over:
        data = {
            'interval': over.interval, 
            'start_date':over.start_date, 
            'comment':over.comment, 
            'is_over':over.is_over, 
            }
        return JsonResponse(data, safe=False)
    return HttpResponse('not')

@login_required
def order_edit(request):
    if request.method == 'POST':
        date = request.POST["date"]
        id = request.POST["id"]
        interval = request.POST["interval"]
        person_id = request.POST["person_id"]
        comment = request.POST["comment"]
        is_over = request.POST["is_over"] == "True"

        over = Overs.objects.filter(pk=id).first()
        if not over:
            return HttpResponse('not found')
        if over.status != Overs.REGISTRED:
            return HttpResponse('not registred')

        try:
            over.start_date = date
            over.interval = interval
            over.comment = comment
            over.is_over = is_over
            over.person_id = person_id
            over.save()
        except Exception as ex:
            return HttpResponse(ex)
        return HttpResponse('ok')
    return HttpResponse('not post')

# Views
@csrf_protect
def main(request):
    return render(request, 'route.html', {
        'ANGULAR_URL' : settings.ANGULAR_URL,
        })

# Data manip
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

# Views
def register(request, param):
    changeStatus(param, Overs.REGISTRED)
    return HttpResponse(' param:' + param)

@login_required
def register_overwork(request):
    logging.debug('register_overwork')
    if request.method == 'POST':
        return register_interval(request, True)
    return HttpResponse('not')

@login_required
def register_unwork(request):
    logging.debug('register_unwork')
    if request.method == 'POST':
        return register_interval(request, False)
    return HttpResponse('not')

def register_interval(request, is_over):
    date = request.POST["date"]
    interval = request.POST["interval"]
    person_id = request.POST["person_id"]
    comment = request.POST["comment"]
    mail_register_udwork(person_id, date, interval, comment, is_over)

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
    return JsonResponse(summarize_query(), safe=False)

def registred(request):
    return JsonResponse(overwork_query('R'), safe=False)

def accepted(request):
    return JsonResponse(overwork_query('A'), safe=False)

def denied(request):
    return JsonResponse(overwork_query('D'), safe=False)

ensure_manager_exist()
