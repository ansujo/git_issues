from rest_framework.response import Response
from rest_framework import status

def check_user_permission(request, resource, action):
    """
    Check if logged-in user has permission for the resource and action
    based on Role.permissions JSON field.
    """

    user = request.user

    # ✅ Superuser has full access
    if user.is_superuser:
        return True

    # ✅ User must have role assigned
    if not hasattr(user, "assigned_role") or not user.assigned_role.role:
        return Response(
            {"detail": "No role assigned"},
            status=status.HTTP_403_FORBIDDEN
        )

    role = user.assigned_role.role
    permissions = role.permissions or {}  # ✅ Safe fallback

    # ✅ Check resource permissions section
    if resource not in permissions:
        return Response(
            {"detail": f"No permission set for {resource}"},
            status=status.HTTP_403_FORBIDDEN
        )

    resource_perms = permissions[resource]

    # ✅ Check if requested action is allowed
    if not resource_perms.get(action, False):
        return Response(
            {
                "detail": f"Permission denied for {action} on {resource}",
                "role": role.name,
                "permissions": resource_perms
            },
            status=status.HTTP_403_FORBIDDEN
        )

    return True
