# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase
from django.contrib.auth.models import User
from django.conf import settings
from .models import Overs, Person

debug = True
#debug = False

def drint(arg):
    if debug:
        print(arg)

class SimpleTest(TestCase):
    def test_root(self):
        print('*** Test view')
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        drint('test view ok')

    def test_manager(self):
        print('*** Test persons')
        persons = Person.objects.all()
        self.assertEqual(len(persons), 1, "manager not created")
        drint(persons[0])

    def test_registration(self):
        print('*** Test registration')
        response = self.client.post('/register_user/', {
            'username':'testuser',
            'password':'1',
            'email':'email@mail.com',
            'first_name':'first_name',
            'last_name':'last_name',
                    })
        drint(response)
        persons = Person.objects.all()
        self.assertEqual(len(persons), 2, "test user not created")
        drint(persons[1])
        self._test_login()

    def _test_login(self):
        print('*** Test login')
        response = self.client.post('/login/', {
            'username':'testuser',
            'password':'1',
                    })
        drint(response)
        response = self.client.get('/')
        user = User.objects.get(username='testuser')
        drint(response.context.request.user.is_authenticated)
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
        response = self.client.post('/login/', {
            'username':'testuser',
            'password':'1',
                    })
        self.client.login(username='manager', password=settings.MANAGER_PWD)

    def test_sum(self):
        print("*** Test summary")
        response = self.client.get('/summarize/')
        json = response.json()
        drint(json)
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
        print("***Check is added to registred")
        response = self.client.get('/registred/')

        drint(response)
        json = response.json()
        record = json[0]
        drint(record)
        record_id = record['id']
        self.assertEqual(len(json), 1)
        self.assertEqual(record['interval'], 60)
        self.assertEqual(record['start_date'], '2001-01-01')
        self.assertEqual(record['is_over'], True)
        self.assertEqual(record['person_id'], self.person_id)

        print("*** Check accept")
        #drint(record_id)
        response = self.client.get('/accept/' + str(record_id) + '/' + '90')
        self.assertEqual(response.content, 'ok')
        #drint(response)

        print("*** Check it add to sum")
        json = self.client.get('/summarize/').json()
        #drint(json)
        for line in json:
            if line['person_id'] == self.person_id:
                self.assertEqual(line['overwork'], 90)
            drint(line['overwork'])


