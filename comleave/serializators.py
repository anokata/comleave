from overwork.models import Person, Overs
from rest_framework import serializers

class PersonSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Person
        fields = ('name', 'is_manager')

class OverworkSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Overs
        fields = ('reg_date', 'start_date', 'interval', 'status', 'comment', 'person')



class SummarySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    interval = serializers.IntegerField()
    name = serializers.CharField(max_length=200)
    reg_date = serializers.DateTimeField()

    def create(self, validated_data):
        return SummarySerializer.objects.create(**validated_data)

