# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import datetime

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
from django.views.generic import TemplateView, View
from django.conf import settings
from django.contrib.auth.decorators import user_passes_test
from django.contrib import auth

from .models import Overs, Person


def logout(request):
    auth.logout(request)
    return HttpResponseRedirect("/")

def main(request):
    template = loader.get_template('route.html')
    return HttpResponse(template.render({
        'ANGULAR_URL' : settings.ANGULAR_URL,
        'is_staff': request.user.is_staff,
        'is_logged': request.user.is_authenticated(),
        }))

def persons_(request):
    persons = Person.objects.order_by('name')
    template = loader.get_template('overwork/index.html')
    context = {
        'persons': persons,
    }
    return HttpResponse(template.render(context))

def person(request):
    template = loader.get_template('overwork/persons.html')
    return HttpResponse(template.render({}))

def action(request, action, param):
    #TEST
    return HttpResponse('act:' + action + ' param:' + param)

def changeStatus(over_id, status):
    over = Overs.objects.filter(pk=over_id).first()
    if over:
        over.status = status
        over.save()

def user_is_staff(user):
    return user.is_authenticated() and user.is_staff

@user_passes_test(user_is_staff, login_url="/accounts/login/")
def accept(request, param):
    changeStatus(param, Overs.ACCEPT)
    return HttpResponse(' param:' + param)

def deny(request, param):
    changeStatus(param, Overs.DENIED)
    return HttpResponse(' param:' + param)

def register(request, param):
    changeStatus(param, Overs.REGISTRED)
    return HttpResponse(' param:' + param)

def register_overwork(request, date, interval, person_id, comment):
    return register_interval(request, date, interval, person_id, comment, True)

def register_unwork(request, date, interval, person_id, comment):
    return register_interval(request, date, interval, person_id, comment, False)

def register_interval(request, date, interval, person_id, comment, is_over):
    person = Person.objects.filter(pk=person_id).first()
    if not person: return 'no person'
    date = datetime.datetime.strptime(date, "%m.%d.%Y")
    now = datetime.datetime.now()
    over = Overs(start_date=date, reg_date=now, comment=comment, 
            interval=interval, person=person, is_over=is_over)
    over.save()
    return HttpResponse(str(date) + ' ' + interval + ' ' + person.name + str(over))

def delete(request, over_id):
    Overs.objects.get(id=over_id).delete()
    return HttpResponse(' param:' + over_id)
