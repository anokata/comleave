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
from django import forms 
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from django.contrib.auth import authenticate, login
class RegistrationForm(UserCreationForm):
    first_name = forms.CharField(max_length=30)
    last_name = forms.CharField(max_length=30)

    class Meta:
        model = User
        fields = ("first_name", "last_name", "username" )

    def save(self, commit=True):
        user = super(RegistrationForm, self).save(commit=False)
        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]
        person = Person(login=user.username, 
                name=user.first_name + ' ' + user.last_name,
                is_manager=False)
        if commit:
            user.save()
            person.save()
        return user

def register_user(request):
    form = RegistrationForm(data=request.POST or None)
    if request.method == 'POST' and form.is_valid():
        user = form.save()
        login(request, user)
        return HttpResponseRedirect('/accounts/login/')
    return render(request, 'register.html', {'form': form})

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

#def action(request, action, param):
    #return HttpResponse('act:' + action + ' param:' + param)

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
    return HttpResponse('ok')

@user_passes_test(user_is_staff, login_url="/accounts/login/")
def delete(request, over_id):
    Overs.objects.get(id=over_id).delete()
    return HttpResponse(' param:' + over_id)
