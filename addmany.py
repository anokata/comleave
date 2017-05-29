from overwork.models import Person, Overs
from django.contrib.auth.models import User
from django.utils import timezone

person = Person.objects.all().first()
for x in range(1000):
    o = Overs(start_date="2001-01-01", person=person, reg_date=timezone.now(),
            interval=60, is_over=True)
    o.save()

