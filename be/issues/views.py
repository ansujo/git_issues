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


# ✨ CHANGED HERE: lookup by slug instead of pk
class ProjectDetail(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = 'slug'   # <---- changed


# ---- ISSUE ----
class IssueListCreate(generics.ListCreateAPIView):
    serializer_class = IssueSerializer

    def get_queryset(self):
        # ✨ CHANGED HERE: Get project by slug instead of ID
        slug = self.kwargs['slug']
        project = Project.objects.get(slug=slug)  # <---- changed
        return Issue.objects.filter(project=project)

    def perform_create(self, serializer):
        # ✨ CHANGED HERE: Save issue with project by slug
        slug = self.kwargs['slug']
        project = Project.objects.get(slug=slug)  # <---- changed
        serializer.save(project=project)


# ✨ CHANGED HERE: No change in logic for Issue itself, but project lookup by slug is used in URL
class IssueDetail(generics.RetrieveAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    lookup_field = 'pk'
