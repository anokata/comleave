# -*- coding: utf-8 -*-
from django.conf import settings
import ldap
import logging

log = logging.getLogger('ldap.auth')
logging.basicConfig(level=logging.INFO)


class ActiveDirectoryBackend:
    def __init__(self, username=None, password=None):
        if not all([password, username]):
            e = Exception('Empty field in credentials.')
            log.critical(e)
            raise e
        self.username = username
        self.password = password

    def authenticate(self):
        try:
            binddn = '%s@%s' % (self.username, settings.AD_NT4_DOMAIN)
            l = ldap.initialize(settings.AD_LDAP_URL)
            l.set_option(ldap.OPT_PROTOCOL_VERSION, 3)
            l.set_option(ldap.OPT_REFERRALS, 0)
            l.simple_bind_s(binddn, self.password)
            result = l.search_ext_s(settings.AD_SEARCH_DN, ldap.SCOPE_SUBTREE,
                                'sAMAccountName=%s' % self.username, settings.AD_SEARCH_FIELDS)[0][1]
            l.unbind_s()
        except Exception as e:
            log.critical(e)
            raise e

        if result:
            first_name = result.get('givenName')
            first_name = first_name and first_name[0]
            last_name = result.get('sn')
            last_name = last_name and last_name[0]
            email = result.get('mail')
            email = email and email[0]
            first_name = first_name.decode('utf-8')
            last_name = last_name.decode('utf-8')

            return {'username': self.username,
                    'first_name': first_name,
                    'last_name': last_name,
                    'email': email}
