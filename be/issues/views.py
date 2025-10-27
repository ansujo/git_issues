from rest_framework import viewsets
from .base_viewset import BaseViewSet
from .models import User, Project, Issue,PullReq,UserPermission
from .serializers import UserSerializer, ProjectSerializer, IssueSerializer, PullReqSerializer

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserPermission

def create_default_permissions(user):
    resources=["project","issue","pullreq"]
    for res in resources:
        UserPermission.objects.create(
            user=user,
            resource=res,
            can_create=True,
            can_view=True,
            can_edit=True,
            can_delete=True
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_auth(request):
    return Response({"user": request.user.username})

@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf_token(request):
    return Response({"message": "CSRF cookie set"})


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    user = User.objects.create_user(username=username, password=password, email=email)
    create_default_permissions(user) #where we call the method to make entry to permission data base
    return Response({"message": "User created successfully"})


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({"message": "Logged in successfully"})
    else:
        return Response({"error": "Invalid credentials"}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({"message": "Logged out successfully"})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ProjectViewSet(BaseViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    resource_name="project"


class IssueViewSet(BaseViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    resource_name="issue"

    def get_queryset(self):
        queryset = super().get_queryset()
        project_id = self.request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset

    def perform_create(self, serializer):
        project_id = self.request.data.get('project')
        serializer.save(project_id=project_id)

class PullReqViewSet(BaseViewSet):
    queryset =PullReq.objects.all()
    serializer_class = PullReqSerializer
    resource_name="pullreq"

    def get_queryset(self):
        queryset=super().get_queryset()
        project_id = self.request.query_params.get('project')
        if project_id:
            queryset=queryset.filter(project_id=project_id)
        return queryset
    
    def perform_create(self,serializer):
        project_id = self.request.data.get('project')
        serializer.save(project_id=project_id)
