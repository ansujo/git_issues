from rest_framework import serializers
# Assuming your models are correctly imported here
from .models import User, Project, Issue

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'created_at', 'user']


class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ['id', 'title', 'description', 'status', 'created_at', 'project']
        # --- FIX APPLIED HERE ---
        # The 'project' field is a Foreign Key and is required by default.
        # We set 'required': False to allow the POST request to pass validation.
        # The project ID will then be automatically supplied by the view's perform_create method.
        extra_kwargs = {
            'project': {'required': False}
        }
