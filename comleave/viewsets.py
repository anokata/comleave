from overwork.models import Person, Overs
from rest_framework import viewsets
from .serializators import PersonSerializer, OverworkSerializer, SummarySerializer
from django.db.models import Sum

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer

class OverworkViewSet(viewsets.ModelViewSet):
    queryset = Overs.objects.all()
    serializer_class = OverworkSerializer


class SummaryViewSet(viewsets.ModelViewSet):
    q = "select overwork_overs.id, overwork_person.name as name, overwork_overs.start_date, sum(interval) as interval, reg_date "\
        "from overwork_overs " \
        "inner join overwork_person on person_id=overwork_person.id " \
        "where status='A' group by overwork_person.name, reg_date, overwork_overs.id"
    queryset = Overs.objects.raw(q)
    serializer_class = SummarySerializer
