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
    overwork = serializers.IntegerField()
    unwork = serializers.IntegerField()
    name = serializers.CharField(max_length=200)

    def create(self, validated_data):
        return SummarySerializer.objects.create(**validated_data)


class RequestsSerializer(serializers.Serializer):
    reg_date = serializers.DateTimeField()
    start_date = serializers.DateTimeField()
    name = serializers.CharField(max_length=200)
    interval = serializers.IntegerField()
    comment = serializers.CharField(max_length=200)
    is_over = serializers.BooleanField()

    def create(self, validated_data):
        return RequestsSerializer.objects.create(**validated_data)
