from overwork.models import Person
from rest_framework import viewsets
from .serializators import PersonSerializer

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
