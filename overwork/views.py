# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import datetime

from django.shortcuts import render
from django.http import HttpResponse
from django.template import RequestContext, loader
from django.views.generic import TemplateView, View
from django.conf import settings

from .models import Overs, Person

def main(request):
    template = loader.get_template('route.html')
    return HttpResponse(template.render({
        'ANGULAR_URL' : settings.ANGULAR_URL,
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

def accept(request, param):
    over = Overs.objects.filter(pk=param).first()
    if over:
        over.status = Overs.ACCEPT
        over.save()
    return HttpResponse(' param:' + param)

def deny(request, param):
    over = Overs.objects.filter(pk=param).first()
    if over:
        over.status = Overs.DENIED
        over.save()
    return HttpResponse(' param:' + param)

def register(request, param):
    over = Overs.objects.filter(pk=param).first()
    if over:
        over.status = Overs.REGISTRED
        over.save()
    return HttpResponse(' param:' + param)

def register_overwork(request, date, interval, person_id, comment):
    person = Person.objects.filter(pk=person_id).first()
    if not person: return 'no person'
    date = datetime.datetime.strptime(date, "%m.%d.%Y")
    now = datetime.datetime.now()
    over = Overs(start_date=date, reg_date=now, comment=comment, 
            interval=interval, person=person, is_over=True)
    over.save()
    return HttpResponse(str(date) + ' ' + interval + ' ' + person.name + str(over))

