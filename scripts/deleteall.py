from overwork.models import Person, Overs
from django.contrib.auth.models import User

all = Person.objects.all()
allusers = User.objects.all()
for x in all:
    print(x, 'deleted')
    x.delete()

for x in allusers:
    print(x, 'deleted')
    x.delete()

for x in Overs.objects.all():
    x.delete()
