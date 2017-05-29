# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase
from django.contrib.auth.models import User
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
        self._test_login()

    def _test_login(self):
        print('*** Test login')
        response = self.client.post('/login/', {
            'username':'testuser',
            'password':'1',
                    })
        print(response)
        response = self.client.get('/')
        user = User.objects.get(username='testuser')
        print(response.context.request.user.is_authenticated)
        assert(response.context.request.user.is_authenticated)
        self.assertEqual(response.context.request.user.email, 'email@mail.com')

        user = self.client.get('/user/').json()
        self.assertEqual(user['username'], 'testuser')
        self.assertEqual(user['is_authenticated'], True)

class SummaryTest(TestCase):
    def setUp(self):
        response = self.client.post('/register_user/', {
            'username':'testuser',
            'password':'1',
            'email':'email@mail.com',
            'first_name':'first_name',
            'last_name':'last_name',
                    })
        self.person_id = Person.objects.filter(login='testuser').first().id

    def test_sum(self):
        print("*** Test summary")
        response = self.client.get('/summarize/')
        json = response.json()
        print(json)
        for line in json:
            self.assertEqual(line['unwork'], 0)
            self.assertEqual(line['overwork'], 0)

    def test_order_over(self):
        print("*** Test order over")
        response = self.client.post('/register_overwork/', {
            'date': '01.01.2001',
            'interval': '60',
            'person_id': self.person_id,
            'comment': 'no com',
            })
        self.assertEqual(response.status_code, 200)
        # check is added to registred
        response = self.client.get('/registred/')

        print(response.json())



