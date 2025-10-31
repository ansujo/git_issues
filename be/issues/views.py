from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie

from django.contrib.auth import get_user_model
from .models import Project, Issue, PullReq, Role, UserRole
from .serializers import UserSerializer, ProjectSerializer, IssueSerializer, PullReqSerializer
from .serializers import RoleSerializer, UserRoleSerializer
from .base_viewset import BaseViewSet
User = get_user_model()

def default_permissions():
    return {
        "project": {"view": True, "create": False, "update": False, "delete": False},
        "issue": {"view": True, "create": False, "update": False, "delete": False},
        "pullreqs": {"view": False, "create": False, "update": False, "delete": False},
    }

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_permissions(request):
    user_role = getattr(request.user, "assigned_role", None)
    
    if user_role and user_role.role:
        role_name = user_role.role.name
        permissions = user_role.role.permissions
    else:
        role_name = None
        permissions = default_permissions()  # fallback

    return Response({
        "role": role_name,
        "permissions": permissions
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_auth(request):
    user = request.user

    role_data = None
    if hasattr(user, "assigned_role") and user.assigned_role.role:
        role_obj = user.assigned_role.role
        role_data = {
            "name": role_obj.name,
            "permissions": role_obj.permissions
        }

    return Response({
        "user": user.username,
        "is_superuser": user.is_superuser,
        "role": role_data
    })



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

    # ✅ Give default role
    basic_role = Role.objects.filter(name="Default User").first()
    if basic_role:
        UserRole.objects.create(user=user, role=basic_role)

    return Response({"message": "User created successfully"})

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)

        # ✅ Fetch assigned role & permissions
        role_data = None
        if hasattr(user, "assigned_role") and user.assigned_role.role:
            role_obj = user.assigned_role.role
            role_data = {
                "name": role_obj.name,
                "permissions": role_obj.permissions
            }

        return Response({
            "message": "Logged in successfully",
            "user": user.username,
            "role": role_data
        })

    return Response({"error": "Invalid credentials"}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({"message": "Logged out successfully"})

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class ProjectViewSet(BaseViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    resource_name = "project"

class IssueViewSet(BaseViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    resource_name = "issue"

    def get_queryset(self):
        project_id = self.request.query_params.get('project')
        return self.queryset.filter(project_id=project_id) if project_id else self.queryset

    def perform_create(self, serializer):
        serializer.save(project_id=self.request.data.get('project'))


class PullReqViewSet(BaseViewSet):
    queryset = PullReq.objects.all()
    serializer_class = PullReqSerializer
    resource_name = "pullreqs"

    def get_queryset(self):
        project_id = self.request.query_params.get('project')
        return self.queryset.filter(project_id=project_id) if project_id else self.queryset

    def perform_create(self, serializer):
        serializer.save(project_id=self.request.data.get('project'))


# ✅ ROLES (Admin-only)
class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({"detail": "Admin only"}, status=403)
        return super().list(request, *args, **kwargs)

# class RoleViewSet(viewsets.ModelViewSet):
#     queryset = Role.objects.all()
#     serializer_class = RoleSerializer
#     permission_classes = [IsAuthenticated]

#     def _check_admin(self, request):
#         if not request.user.is_superuser:
#             return Response({"detail": "Admin only"}, status=403)

#     def list(self, request, *args, **kwargs):
#         if res := self._check_admin(request):
#             return res
#         return super().list(request, *args, **kwargs)

#     def create(self, request, *args, **kwargs):
#         if res := self._check_admin(request):
#             return res
#         return super().create(request, *args, **kwargs)

#     def update(self, request, *args, **kwargs):
#         if res := self._check_admin(request):
#             return res
#         return super().update(request, *args, **kwargs)

#     def destroy(self, request, *args, **kwargs):
#         if res := self._check_admin(request):
#             return res
#         return super().destroy(request, *args, **kwargs)

class UserRoleViewSet(viewsets.ModelViewSet):
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({"detail": "Admin only"}, status=403)

        user_id = request.data.get("user_id")
        role_id = request.data.get("role_id")

        # If mapping exists, update instead of duplicate , it will create error if unique constrain
        existing = UserRole.objects.filter(user_id=user_id).first()
        # existing = queryset.filter(user_id=user_id).first()
        if existing:
            existing.role_id = role_id
            existing.save()
            return Response(self.serializer_class(existing).data, status=200)

        return super().create(request, *args, **kwargs)


