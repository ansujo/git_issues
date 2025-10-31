from django.contrib import admin
from .models import Project, Issue ,PullReq,Role,UserRole #UserPermission # we'll create these in Step 3

admin.site.register(Project)
admin.site.register(Issue) 
admin.site.register(PullReq) 
admin.site.register(Role) 
admin.site.register(UserRole) 

# admin.site.register(UserPermission)
