from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserRegistrationSerializer, UserLoginSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.conf import settings
from datetime import datetime
from .models import LoginActivity, User
from django.utils import timezone
from rest_framework import generics
from .permissions import IsAdmin, IsAdminOrReadOnly
from .serializers import UserSerializer, LoginActivitySerializer
from .permissions import IsAdmin, IsAdminOrReadOnly
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import UserProfileSerializer, ChangePasswordSerializer
from rest_framework.exceptions import PermissionDenied
from django.db import models
import logging

logger = logging.getLogger(__name__)

class UserRegistrationView(APIView):
    """
    View for user registration.
    Anyone can try to register (AllowAny).
    """
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Get the data from the serializer
        response_data = {
            'message': 'User registered successfully.',
            'user': {
                'email': serializer.data['email'],
                'username': serializer.data.get('username'),
                'role': serializer.data.get('role', 'user')
            }
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)

class UserLoginView(APIView):
    """
    View for user login.
    Anyone can try to login (AllowAny).
    """
    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # If validation is successful, the serializer's `validate` method returns our data
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Include the user's role in the token payload
        token = super().get_token(user)
        token['role'] = user.role
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            tokens = response.data
            
            # Set access token cookie
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=tokens['access'],
                max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
                path='/',
                secure=True,
                httponly=True,
                samesite='None'
            )
            
            # Set refresh token cookie
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=tokens['refresh'],
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
                path='/',
                secure=True,
                httponly=True,
                samesite='None'
            )

            # Log cookie setting for debugging
            logger.debug("Setting auth cookies in response")
            logger.debug(f"Response cookies: {response.cookies}")
            
            # Remove tokens from response body
            response.data = {
                'email': request.user.email,
                'username': request.user.username,
                'role': request.user.role
            }

        return response

    def get_client_ip(self, request):
        """
        Extract the client's IP address from the request.
        Handles various proxy scenarios.
        """
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]  # Get the first IP in the chain
        else:
            ip = request.META.get('REMOTE_ADDR')  # Direct connection
        return ip

class UserLogoutView(APIView):
    """
    View for user logout. Clears the JWT cookies.
    """
    permission_classes = () # No specific permissions needed to logout

    def post(self, request):
        response = Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        
        # Delete the access token cookie
        response.delete_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
        )
        # Delete the refresh token cookie
        response.delete_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
            path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
        )
        
        return response
    
# Update UserListView for search and filtering
class UserListView(generics.ListAPIView):
    """
    Admin-only endpoint to list all users with search and filtering.
    """
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        queryset = User.objects.all()
        
        # Search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                models.Q(email__icontains=search) |
                models.Q(username__icontains=search)
            )
        
        # Role filtering
        role = self.request.query_params.get('role', None)
        if role and role != 'all':
            queryset = queryset.filter(role=role)
        
        # Active status filtering
        active = self.request.query_params.get('active', None)
        if active and active != 'all':
            active_bool = active.lower() == 'true'
            queryset = queryset.filter(is_active=active_bool)
        
        return queryset.order_by('-created_at')

# Update the UserDetailView to handle user updates and deletion
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Admin-only endpoint to view, update, or delete a specific user.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def perform_destroy(self, instance):
        # Prevent admin from deleting themselves
        if instance == self.request.user:
            raise PermissionDenied("You cannot delete your own account.")
        instance.delete()

# Add a new view for user creation by admin
class UserCreateView(generics.CreateAPIView):
    """
    Admin-only endpoint to create new users.
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [IsAdmin]

# Update LoginActivityListView for filtering
class LoginActivityListView(generics.ListAPIView):
    """
    Admin-only endpoint to view all login activities with filtering.
    """
    serializer_class = LoginActivitySerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        queryset = LoginActivity.objects.all()
        
        # User filtering
        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        # Date range filtering
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(timestamp__gte=start_date)
        if end_date:
            queryset = queryset.filter(timestamp__lte=end_date)
        
        return queryset.order_by('-timestamp')

class AdminDashboardView(APIView):
    """
    Admin dashboard with statistics and overview.
    """
    permission_classes = [IsAdmin]
    
    def get(self, request):
        total_users = User.objects.count()
        total_admins = User.objects.filter(role=User.Role.ADMIN).count()
        total_regular_users = User.objects.filter(role=User.Role.USER).count()
        recent_logins = LoginActivity.objects.order_by('-timestamp')[:10]
        
        data = {
            'total_users': total_users,
            'total_admins': total_admins,
            'total_regular_users': total_regular_users,
            'recent_logins': [
                {
                    'user_email': login.user.email,
                    'ip_address': login.ip_address,
                    'timestamp': login.timestamp
                }
                for login in recent_logins
            ]
        }
        
        return Response(data)    

# New view for users to see their own login history
class UserLoginHistoryView(generics.ListAPIView):
    """
    Endpoint for users to view their own login history.
    """
    serializer_class = LoginActivitySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Return only the current user's login activities
        return LoginActivity.objects.filter(user=self.request.user)
    
# Views for user profile and password change
class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Endpoint for users to view and update their own profile.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Return the full updated user object
        return Response(serializer.data)

class ChangePasswordView(APIView):
    """
    Endpoint for users to change their password.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response(
            {"message": "Password changed successfully."},
            status=status.HTTP_200_OK
        )