from django.contrib import admin

# Register your models here.


# Register your models here.
from django.contrib import admin
from .models import Project, Issue ,PullReq # we'll create these in Step 3

admin.site.register(Project)
admin.site.register(Issue) 
admin.site.register(PullReq) 
