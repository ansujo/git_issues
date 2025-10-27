from rest_framework.response import Response
from rest_framework import status
from .models import UserPermission

def check_user_permission(request,resource,action):
    user=request.user
    if not user or not user.is_authenticated:
        return Response({"error":"Authentication required"},status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        perm=UserPermission.objects.get(user=user, resource=resource)
    except UserPermission.DoesNotExist:
        return Response({"error": f"No permissions set for {resource}"}, status=status.HTTP_403_FORBIDDEN)
    
    if action == "create" and not perm.can_create:
        return Response({"error": f"You are not allowed to create {resource}"}, status=status.HTTP_403_FORBIDDEN)
    elif action == "edit" and not perm.can_edit:
        return Response({"error": f"You are not allowed to edit {resource}"}, status=status.HTTP_403_FORBIDDEN)
    elif action == "delete" and not perm.can_delete:
        return Response({"error": f"You are not allowed to delete {resource}"}, status=status.HTTP_403_FORBIDDEN)
    elif action == "view" and not perm.can_view:
        return Response({"error": f"You are not allowed to view {resource}"}, status=status.HTTP_403_FORBIDDEN)
    
    return None
