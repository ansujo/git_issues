from django.db import models
from django.db.models import JSONField
from django.contrib.auth import get_user_model


User = get_user_model()


from django.db import models
from django.db.models import JSONField

def default_permissions():
    return {
        "project": {"view": True, "create": False, "update": False, "delete": False},
        "issue": {"view": True, "create": False, "update": False, "delete": False},
        "pullreqs": {"view": False, "create": False, "update": False, "delete": False},
    }

class Role(models.Model):
    name = models.CharField(max_length=100, unique=True)
    permissions = JSONField(default=default_permissions)

    def __str__(self):
        return self.name


class UserRole(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="assigned_role"
    )
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.user.username} → {self.role.name if self.role else 'No Role'}"

class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Issue(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('closed', 'Closed'),
    ]

    LABEL_CHOICES = [
        ('bug', 'Bug'),
        ('enhancement', 'Enhancement'),
        ('documentation', 'Documentation'),
        ('feature', 'Feature'),
        ('ui', 'Ui'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='issues')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    label = models.CharField(max_length=50, choices=LABEL_CHOICES, default='bug')
    
    assignee = models.ForeignKey(
        User, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='assigned_issues'
    )
    reviewer = models.ForeignKey(
        User, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='reviewing_issues'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.status})"


class PullReq(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('closed', 'Closed'),
    ]

    LABEL_CHOICES = [
        ('bug', 'Bug'),
        ('development', 'Development'),
        ('enhancement', 'Enhancement'),
        ('ui', 'Ui'),
        ('documentation', 'Documentation'),
        ('feature', 'Feature'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='pullreqs')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    label = models.CharField(max_length=50, choices=LABEL_CHOICES, default='bug')

    issue = models.ForeignKey(
        Issue, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='pull_requests'
    )

    assignee = models.ForeignKey(
        User, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='assigned_pullreqs'
    )
    reviewer = models.ForeignKey(
        User, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='reviewing_pullreqs'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.status})"
