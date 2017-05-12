# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from django.template import RequestContext, loader

from .models import Overs, Person

def test(request):
    return HttpResponse("hi")

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
