from overwork.models import Person
from django.contrib.auth.models import User

me = Person.objects.filter(login='tikhomirovsvl').first()
meuser = User.objects.filter(username='tikhomirovsvl').first()
if me:
    print(me)
    me.delete()
    print('ok deleted')

if meuser:
    print(meuser)
    meuser.delete()
    print('ok deleted')

