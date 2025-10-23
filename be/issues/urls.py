from django.urls import path, include
from rest_framework import viewsets
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ProjectViewSet, IssueViewSet,PullReqViewSet,register_view,login_view,logout_view,get_csrf_token,check_auth
from .models import User, Project, Issue,PullReq
from .serializers import UserSerializer, ProjectSerializer, IssueSerializer, PullReqSerializer

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'issues', IssueViewSet)
router.register(r'pullreqs',PullReqViewSet)



urlpatterns = [
    path('', include(router.urls)),
    path('check-auth/', check_auth, name='check-auth'),
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('csrf/', get_csrf_token, name='csrf'),
]
