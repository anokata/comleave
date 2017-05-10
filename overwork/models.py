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
    STATUS_CHOISES = (
        ('R', 'Registred'),
        ('D', 'Denied'),
        ('A', 'Accepted'),
    )
    reg_date = models.DateTimeField('date registred')
    start_date = models.DateTimeField('start date')
    interval = models.IntegerField()
    status = models.CharField(max_length=100,
                                  choices=STATUS_CHOISES,
                                  default='R')
    comment = models.CharField(max_length=512)
    # ref on person

    def __str__(self):
        return self.reg_date.strftime("%Y.%m.%d") + ' ' \
                + self.get_status_display() + '  ' \
                + str(self.interval) + ' hours'

