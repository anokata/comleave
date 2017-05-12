# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Person(models.Model):
    name = models.CharField(max_length=200)
    is_manager = models.BooleanField()

    def __str__(self):
        return self.name  + (' (+)' if self.is_manager else ' (-)')


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

