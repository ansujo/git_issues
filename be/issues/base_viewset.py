from rest_framework import viewsets, status
from rest_framework.response import Response
from .utils import check_user_permission


class BaseViewSet(viewsets.ModelViewSet):
    """
    A reusable base ViewSet that automatically checks user permissions
    before performing CRUD actions.
    """

    resource_name = None  # each subclass (Issue, Project...) will define this

    def create(self, request, *args, **kwargs):#create
        perm = check_user_permission(request, self.resource_name, "create")
        if perm is not None:
            return perm
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):#edit
        perm = check_user_permission(request, self.resource_name, "edit")
        if perm is not None:
            return perm
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):#delete
        perm = check_user_permission(request, self.resource_name, "delete")
        if perm is not None:
            return perm
        return super().destroy(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):#view list
        perm = check_user_permission(request, self.resource_name, "view")
        if perm is not None:
            return perm
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):#when we need a single item
        perm = check_user_permission(request, self.resource_name, "view")
        if perm is not None:
            return perm
        return super().retrieve(request, *args, **kwargs)
