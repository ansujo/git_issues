from rest_framework import viewsets
from .models import User, Project, Issue,PullReq
from .serializers import UserSerializer, ProjectSerializer, IssueSerializer, PullReqSerializer

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie

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


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        project_id = self.request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset

    def perform_create(self, serializer):
        project_id = self.request.data.get('project')
        serializer.save(project_id=project_id)

class PullReqViewSet(viewsets.ModelViewSet):
    queryset =PullReq.objects.all()
    serializer_class = PullReqSerializer

    def get_queryset(self):
        queryset=super().get_queryset()
        project_id = self.request.query_params.get('project')
        if project_id:
            queryset=queryset.filter(project_id=project_id)
        return queryset
    
    def perform_create(self,serializer):
        project_id = self.request.data.get('project')
        serializer.save(project_id=project_id)
