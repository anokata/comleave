# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase
from .models import Overs, Person

class SimpleTest(TestCase):
    def test_root(self):
        print('*** Test view')
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        print('test view ok')

    def test_manager(self):
        print('*** Test persons')
        persons = Person.objects.all()
        self.assertEqual(len(persons), 1, "manager not created")
        print(persons[0])

    def test_registration(self):
        print('*** Test registration')
        response = self.client.post('/register_user/', {
            'username':'testuser',
            'password':'1',
            'email':'email@mail.com',
            'first_name':'first_name',
            'last_name':'last_name',
                    })
        print(response)
        persons = Person.objects.all()
        self.assertEqual(len(persons), 2, "test user not created")
        print(persons[1])

