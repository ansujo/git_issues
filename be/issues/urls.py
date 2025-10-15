from django.urls import path
from . import views

urlpatterns = [
    # user
    path('user/', views.SingleUserView.as_view(), name='single_user'),

    # projects
    path('projects/', views.ProjectListCreate.as_view(), name='project_list_create'),
    path('projects/<int:pk>/', views.ProjectDetail.as_view(), name='project_detail'),

    # issues
    path('projects/<int:project_id>/issues/', views.IssueListCreate.as_view(), name='issue_list_create'),
    path('projects/<int:project_id>/issues/<int:pk>/', views.IssueDetail.as_view(), name='issue_detail'),
]
