# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase
from django.contrib.auth.models import User
from django.conf import settings
from .models import Overs, Person

debug = True
debug = False

TEST_USERNAME = 'testuser'
DEFAULT_DATE = '01.01.2001'
DEFAULT_DATE_BASE = '2001-01-01'

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
            'username':TEST_USERNAME,
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
            'username':TEST_USERNAME,
            'password':'1',
                    })
        drint(response)
        response = self.client.get('/')
        user = User.objects.get(username=TEST_USERNAME)
        drint(response.context.request.user.is_authenticated)
        assert(response.context.request.user.is_authenticated)
        self.assertEqual(response.context.request.user.email, 'email@mail.com')

        user = self.client.get('/user/').json()
        self.assertEqual(user['username'], TEST_USERNAME)
        self.assertEqual(user['is_authenticated'], True)

class SummaryTest(TestCase):
    def setUp(self):
        response = self.client.post('/register_user/', {
            'username':TEST_USERNAME,
            'password':'1',
            'email':'email@mail.com',
            'first_name':'first_name',
            'last_name':'last_name',
                    })
        self.person_id = Person.objects.filter(login=TEST_USERNAME).first().id
        response = self.client.post('/login/', {
            'username':TEST_USERNAME,
            'password':'1',
                    })
        self.client.login(username='manager', password=settings.MANAGER_PWD)

    def sum_is_zero(self):
        print("*** Test summary")
        json = self.summary_eq(0)
        for line in json:
            self.assertEqual(line['unwork'], 0)
            self.assertEqual(line['overwork'], 0)

    def register_over(self, interval=60, date='01.01.2001', comment='no comment'):
        response = self.client.post('/register_overwork/', {
            'date': date,
            'interval': str(interval),
            'person_id': self.person_id,
            'comment': comment,
            })
        self.assertEqual(response.status_code, 200)

    def summary_eq(self, total_over=False, total_un=False):
        print("*** Check sum")
        json = self.client.get('/summarize/').json()
        for line in json:
            if line['person_id'] == self.person_id:
                if total_over:
                    self.assertEqual(line['overwork'], total_over)
                if total_un:
                    self.assertEqual(line['unwork'], total_un)
        return json

    def check_last(self, type, interval=60, date=DEFAULT_DATE_BASE, is_over=True):
        print("***Check last " + type)
        record = self.client.get(type).json()[0]
        drint(record)
        record_id = record['id']
        self.assertEqual(record['interval'], interval)
        self.assertEqual(record['start_date'], date)
        self.assertEqual(record['is_over'], is_over)
        self.assertEqual(record['person_id'], self.person_id)
        return record_id

    def accept(self, id, interval=0):
        print("*** Check accept")
        response = self.client.get('/accept/' + str(id) + '/' + str(interval))
        self.assertEqual(response.content, 'ok')
        return response

    def deny(self, id):
        print("*** Check deny")
        response = self.client.get('/deny/' + str(id))
        self.assertEqual(response.content, 'ok')
        return response

    def test_order_over(self):
        self.sum_is_zero()
        self.register_over(interval=60)
        record_id = self.check_last('/registred/')
        self.accept(record_id, 90)
        record_id = self.check_last('/accepted/', interval=90)
        self.summary_eq(90)

        self.register_over(interval=90)
        record_id = self.check_last('/registred/', interval=90)
        self.accept(record_id)
        record_id = self.check_last('/accepted/', interval=90)
        self.summary_eq(total_over=180)

        self.register_over(interval=120)
        record_id = self.check_last('/registred/', interval=120)
        self.deny(record_id)
        record_id = self.check_last('/denied/', interval=120)
        self.summary_eq(total_over=180)


