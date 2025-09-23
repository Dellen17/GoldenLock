from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admin users.
    """
    def has_permission(self, request, view):
        # Check if user is authenticated and is an admin
        return bool(request.user and request.user.is_authenticated and 
                   (request.user.role == request.user.Role.ADMIN or request.user.is_superuser))

class IsUser(permissions.BasePermission):
    """
    Custom permission to only allow regular users (non-admin).
    """
    def has_permission(self, request, view):
        # Check if user is authenticated and is a regular user
        return bool(request.user and request.user.is_authenticated and 
                   request.user.role == request.user.Role.USER)

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow:
    - Read-only access to all users (including unauthenticated)
    - Full access only to admin users
    """
    def has_permission(self, request, view):
        # Allow safe methods (GET, HEAD, OPTIONS) to all
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # For unsafe methods (POST, PUT, DELETE), only allow admins
        return bool(request.user and request.user.is_authenticated and 
                   (request.user.role == request.user.Role.ADMIN or request.user.is_superuser))