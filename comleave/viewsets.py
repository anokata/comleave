from overwork.models import Person, Overs
from rest_framework import viewsets
from .serializators import PersonSerializer, OverworkSerializer, SummarySerializer
from .serializators import RequestsSerializer
from django.db.models import Sum

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer

class OverworkViewSet(viewsets.ModelViewSet):
    queryset = Overs.objects.all()
    serializer_class = OverworkSerializer


class SummaryViewSet(viewsets.ModelViewSet):
    q = "select oo.id, oo.name, oo.login, "\
        "coalesce((select sum(interval) as downwork "\
        "from overwork_overs "\
        "where status='A' AND is_over='f' and person_id=oo.id ) , 0) as unwork, "\
        "coalesce((select sum(interval) as upwork "\
        "from overwork_overs join overwork_person on overwork_overs.person_id=overwork_person.id "\
        "where status='A' AND is_over='t' and person_id=oo.id), 0) as overwork "\
        "from overwork_person as oo;";
    queryset = Overs.objects.raw(q)
    serializer_class = SummarySerializer

def overwork_query(status):
    return "select overwork_overs.id, reg_date, start_date, interval, comment, name, is_over "\
        "from overwork_overs inner join overwork_person "\
        "on overwork_overs.person_id=overwork_person.id "\
        "where overwork_overs.status='" + status + "' order by reg_date desc"

class RequestsViewSet(viewsets.ModelViewSet):
    queryset = Overs.objects.raw(overwork_query('R'))
    serializer_class = RequestsSerializer

class DeniedViewSet(viewsets.ModelViewSet):
    queryset = Overs.objects.raw(overwork_query('D'))
    serializer_class = RequestsSerializer

class AcceptedViewSet(viewsets.ModelViewSet):
    queryset = Overs.objects.raw(overwork_query('A'))
    serializer_class = RequestsSerializer
