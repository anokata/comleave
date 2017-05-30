from overwork.models import Person, Overs
from django.contrib.auth.models import User
from django.utils import timezone

p = Person.objects.all().first()

for x in range(25):
    o = Overs(start_date="2001-01-01", person=p, reg_date=timezone.now(),
            interval=60, is_over=True, comment=str(x))
    o.save()
