from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Project, Issue, PullReq,
    Role, UserRole
)

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


# ✅ Role Serializer (now using JSONField directly)
class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ["id", "name", "permissions"]

class UserRoleSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="user",
        write_only=True
    )

    class Meta:
        model = UserRole
        fields = ["id", "user", "user_id", "role"]

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "id", "name", "description",
            "created_at", "user"
        ]
        read_only_fields = ["created_at"]

class IssueSerializer(serializers.ModelSerializer):
    assignee = UserSerializer(read_only=True)
    assignee_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="assignee",
        write_only=True,
        required=False
    )

    reviewer = UserSerializer(read_only=True)
    reviewer_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="reviewer",
        write_only=True,
        required=False
    )

    class Meta:
        model = Issue
        fields = [
            "id", "title", "description", "status", "label",
            "project", "created_at",
            "assignee", "assignee_id",
            "reviewer", "reviewer_id"
        ]
        read_only_fields = ["created_at"]

class PullReqSerializer(serializers.ModelSerializer):
    assignee = UserSerializer(read_only=True)
    assignee_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="assignee",
        write_only=True,
        required=False
    )

    reviewer = UserSerializer(read_only=True)
    reviewer_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="reviewer",
        write_only=True,
        required=False
    )

    issue = IssueSerializer(read_only=True)
    issue_id = serializers.PrimaryKeyRelatedField(
        queryset=Issue.objects.all(),
        source="issue",
        write_only=True,
        required=False
    )

    class Meta:
        model = PullReq
        fields = [
            "id", "title", "description", "status", "label",
            "project", "created_at",
            "issue", "issue_id",
            "assignee", "assignee_id",
            "reviewer", "reviewer_id",
        ]
        read_only_fields = ["created_at"]
