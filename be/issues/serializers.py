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
    assignee = UserSerializer(read_only=True)
    assignee_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='assignee', write_only=True, required=False
    )

    class Meta:
        model = Issue
        fields = [
            'id','title','description','status','assignee','assignee_id','label','created_at','project'
        ]
        extra_kwargs = {
            'project': {'required': False}
        }
