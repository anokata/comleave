# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-05-11 13:56
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('overwork', '0006_auto_20170511_0941'),
    ]

    operations = [
        migrations.AlterField(
            model_name='overs',
            name='start_date',
            field=models.DateField(verbose_name='start date'),
        ),
    ]
