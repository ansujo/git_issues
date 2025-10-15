from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User, Project, Issue
from .serializers import UserSerializer, ProjectSerializer, IssueSerializer

# ---- USER ----
# For now we have only one user, so let's just return the first user.
class SingleUserView(APIView):
    def get(self, request):
        user = User.objects.first()
        serializer = UserSerializer(user)
        return Response(serializer.data)


# ---- PROJECT ----
class ProjectListCreate(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class ProjectDetail(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


# ---- ISSUE ----
class IssueListCreate(generics.ListCreateAPIView):
    serializer_class = IssueSerializer

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        return Issue.objects.filter(project_id=project_id)

    def perform_create(self, serializer):
        project_id = self.kwargs['project_id']
        serializer.save(project_id=project_id)


class IssueDetail(generics.RetrieveAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
