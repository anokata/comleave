from django.contrib.auth.models import User
from django.conf import settings
from auth import ActiveDirectoryBackend

from .models import Overs, Person
import logging
log = logging.getLogger('main.users')

def ensure_manager_exist():
    try:
        user = User.objects.filter(username='manager').first()
        if user:
            logging.debug('manager exist. OK')
        else:
            logging.debug('manager do not exist')
            add_user('manager', password=settings.MANAGER_PWD, is_staff=True)
            logging.debug('manager created')
    except Exception as ex:
        logging.error(str(ex))
        return

def add_user(username, email='', password='', first_name='', last_name='', is_staff=False):
    user = User.objects.create_user(
            username,
            email=email,
            password=password)
    user.first_name = first_name
    user.last_name = last_name
    user.is_staff = is_staff
    user.save()
    person = Person(login=username, 
        name=first_name + ' ' + last_name,
        is_manager=is_staff,
        email=email)
    person.save()

def ldap_login(user, password):
    try:
        ldap_user = ActiveDirectoryBackend(username=user,
                                           password=password).authenticate()
    except Exception as e:
        log.critical('LDAP Error: {}'.format(e))
        ldap_user = None
        return False

    log.info('Logged in AD-user: {}'.format(ldap_user['username']))
    return ldap_user