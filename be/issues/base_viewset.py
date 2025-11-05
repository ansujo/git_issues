from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .utils import check_user_permission


class BaseViewSet(viewsets.ModelViewSet):
    """
    Base ViewSet with automatic RBAC enforcement.
    Each subclass must define resource_name = "project" | "issue" | "pullreqs"
    """

    resource_name = None

    def _check_permission(self, request, action):
        """
        Internal helper for permission checking.
        """
        perm = check_user_permission(request, self.resource_name, action)
        if perm is not True:
            return perm  # Returns Response Forbidden object
        return None

    def create(self, request, *args, **kwargs):
        perm = self._check_permission(request, "create")
        if perm:
            return perm
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        perm = self._check_permission(request, "update")
        if perm:
            return perm
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        perm = self._check_permission(request, "delete")
        if perm:
            return perm
        return super().destroy(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        perm = self._check_permission(request, "view")
        if perm:
            return perm
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        perm = self._check_permission(request, "view")
        if perm:
            return perm
        return super().retrieve(request, *args, **kwargs)
