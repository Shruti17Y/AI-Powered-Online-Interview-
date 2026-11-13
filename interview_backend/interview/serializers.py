from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from .models import Company, InterviewResult

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']


class AudioUploadSerializer(serializers.Serializer):
    audio = serializers.FileField()


# class JobSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Job
#         fields = '__all__'

class InterviewResultHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewResult
        fields = ['score', 'pass_fail', 'date', 'attempt_number', 'round_type']

class UserInterviewHistorySerializer(serializers.Serializer):
    email = serializers.EmailField()
    attempts = InterviewResultHistorySerializer(many=True)


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)

