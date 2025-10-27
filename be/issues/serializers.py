from rest_framework import serializers
from .models import User, Project, Issue,PullReq

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

    reviewer = UserSerializer(read_only=True)
    reviewer_id= serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='reviewer', write_only=True, required=False
    )

    class Meta:
        model = Issue
        fields = [
            'id','title','description','status','assignee','assignee_id','label','created_at','project','reviewer', 'reviewer_id'
        ]
        extra_kwargs = {
            'project': {'required': False}
        }

class PullReqSerializer(serializers.ModelSerializer):
    assignee = UserSerializer(read_only=True)
    assignee_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='assignee', write_only=True, required=False
    )

    reviewer = UserSerializer(read_only=True)
    reviewer_id= serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='reviewer', write_only=True, required=False
    )

    issue= IssueSerializer(read_only=True)
    issue_id= serializers.PrimaryKeyRelatedField(
        queryset=Issue.objects.all(),source='issue',write_only=True,required=False
    )


    class Meta:
        model = PullReq
        fields = [
            'id','title','description','status','assignee','assignee_id','label','created_at','project','reviewer', 'reviewer_id','issue','issue_id',
        ]
        extra_kwargs = {
            'project': {'required': False}
        }
