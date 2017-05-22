# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from __future__ import print_function
import datetime

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
from django.views.generic import TemplateView, View
from django.conf import settings
from django.contrib.auth.decorators import user_passes_test
from django.contrib import auth
from django.http import JsonResponse
from django.core import serializers

from .models import Overs, Person
from django import forms 
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.mail import send_mail

import logging
logging.basicConfig(level=logging.DEBUG, format=' %(asctime)s - %(levelname)s- %(message)s')
logging.debug('Start of program')

from django.contrib.auth import authenticate, login
class RegistrationForm(UserCreationForm):
    first_name = forms.CharField(max_length=40)
    last_name = forms.CharField(max_length=40)
    email = forms.CharField(max_length=50)

    def __init__(self, user=None, *args, **kwargs):
        super(UserCreationForm, self).__init__(*args, **kwargs)
        if user != None:
            self.fields['first_name'].initial = user.first_name
            self.fields['last_name'].initial = user.last_name
            self.fields['email'].initial = user.email

    class Meta:
        model = User
        fields = ("first_name", "last_name", "username", "email" )

    def save(self, commit=True):
        user = super(RegistrationForm, self).save(commit=False)
        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]
        user.email = self.cleaned_data["email"]
        person = Person(login=user.username, 
                name=user.first_name + ' ' + user.last_name,
                is_manager=False)
        if commit:
            user.save()
            person.save()
        return user

    def update(self, user):
        user.first_name = self.data["first_name"]
        user.last_name = self.data["last_name"]
        user.email = self.data["email"]
        user.save()
        person = Person.objects.filter(login=user.username).first()
        person.name = self.data["first_name"] + ' ' + self.data["last_name"]
        person.email = self.data["email"]
        person.save()
        return user

def register_user(request):
    form = RegistrationForm(data=request.POST or None)
    if request.method == 'POST' and form.is_valid():
        user = form.save()
        login(request, user)
        return HttpResponseRedirect('/accounts/login/')
    return render(request, 'register.html', {'form': form})

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
            user = User.objects.create_user(
                    username,
                    email=email,
                    password=password)
            user.first_name = first_name
            user.last_name = last_name
            user.save()
            person = Person(login=username, 
                name=first_name + ' ' + last_name,
                is_manager=False)
            person.save()
        except Exception as e:
            return HttpResponse(str(e))
        login(request, user)
        return HttpResponse('ok')
    return HttpResponse('not')

def update_user(request):
    form = RegistrationForm(data=request.POST or None, user=request.user)
    if request.method == 'POST':
        user = form.update(request.user)
        return HttpResponseRedirect('/accounts/update/')
    return render(request, 'update.html', {'form': form})

def get_user(request):
    data = {
            'username': request.user.username,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'email': request.user.email,
            'is_staff': request.user.is_staff,
            'is_authenticated': request.user.is_authenticated(),
            }
    return JsonResponse(data, safe=False)

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

def login_user(request):
    if request.method == 'POST':
        try:
            username = request.POST["username"]
            password = request.POST["password"]
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return HttpResponse('ok')
            else:
                return HttpResponse('not')

        except Exception as e:
            return HttpResponse(str(e))
    return HttpResponse('not')


def logout(request):
    auth.logout(request)
    return HttpResponseRedirect("/")

def main(request):
    template = loader.get_template('route.html')
    return HttpResponse(template.render({
        'ANGULAR_URL' : settings.ANGULAR_URL,
        'is_staff': request.user.is_staff,
        'is_logged': request.user.is_authenticated(),
        'login': request.user.username,
        }))

def changeStatus(over_id, status):
    over = Overs.objects.filter(pk=over_id).first()
    if over:
        over.status = status
        over.save()

def user_is_staff(user):
    return user.is_authenticated() and user.is_staff

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

def mail_register_udwork(person_id, date, interval, comment, is_over):
    manager = User.objects.filter(is_staff=True).exclude(is_superuser=True).first()
    if not manager: 
        logging.error("manager not found")
        return
    mail = manager.email
    send_mail(
        'Registred overwork' if is_over else 'Registred unwork',
        make_mail_body(person_id, date, interval, comment, is_over),
        'djangomosreg@mail.ru',
        [mail],
        fail_silently=False,
    )

def register_overwork(request, date, interval, person_id, comment):
    logging.debug('register_overwork')
    mail_register_udwork(person_id, date, interval, comment, True)
    return register_interval(request, date, interval, person_id, comment, True)

def register_unwork(request, date, interval, person_id, comment):
    mail_register_udwork(person_id, date, interval, comment, False)
    return register_interval(request, date, interval, person_id, comment, False)

def register_interval(request, date, interval, person_id, comment, is_over):
    person = Person.objects.filter(pk=person_id).first()
    if not person: return 'no person'
    date = datetime.datetime.strptime(date, "%m.%d.%Y")
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
    query = "select overwork_overs.id, reg_date, start_date, overwork_overs.interval, comment, name, is_over "\
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
        } for q in querydata]
    return data

def registred(request):
    return JsonResponse(overwork_query('R'), safe=False)

def accepted(request):
    return JsonResponse(overwork_query('A'), safe=False)

def denied(request):
    return JsonResponse(overwork_query('D'), safe=False)
