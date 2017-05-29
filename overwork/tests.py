# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase

class SimpleTest(TestCase):
    def test_details(self):
        print('test view')
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        print('test view ok')
