from overwork.models import Person, Overs
from rest_framework import viewsets
from .serializators import OverworkSerializer
from .serializators import RequestsSerializer
from django.db.models import Sum

class OverworkViewSet(viewsets.ModelViewSet):
    queryset = Overs.objects.all()
    serializer_class = OverworkSerializer

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
