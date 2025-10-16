from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.SingleUserView.as_view(), name='single_user'),
    path('projects/', views.ProjectListCreate.as_view(), name='project_list_create'),
    path('projects/<slug:slug>/issues/', views.IssueListCreate.as_view(), name='issue_list_create'),
    path('projects/<slug:slug>/issues/<int:pk>/', views.IssueDetail.as_view(), name='issue_detail'),
    path('projects/<slug:slug>/', views.ProjectDetail.as_view(), name='project_detail'),
]
