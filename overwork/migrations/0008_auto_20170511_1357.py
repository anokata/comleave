# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-05-11 13:57
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('overwork', '0007_auto_20170511_1356'),
    ]

    operations = [
        migrations.AlterField(
            model_name='overs',
            name='reg_date',
            field=models.DateTimeField(auto_now_add=True, verbose_name='date registred'),
        ),
    ]
