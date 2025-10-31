# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    UserViewSet,
    ProjectViewSet,
    IssueViewSet,
    PullReqViewSet,
    RoleViewSet,
    UserRoleViewSet,
    register_view,
    login_view,
    logout_view,
    check_auth,
    get_csrf_token
)

router = DefaultRouter()
router.register('roles', RoleViewSet)
router.register('user-roles', UserRoleViewSet)
router.register('projects', ProjectViewSet)
router.register('issues', IssueViewSet)
router.register('pullreqs', PullReqViewSet)
router.register('users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('check-auth/', check_auth, name='check-auth'),
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('csrf/', get_csrf_token, name='csrf'),
    # path('get-csrf-token/', get_csrf_token, name='get-csrf-token'),

]
