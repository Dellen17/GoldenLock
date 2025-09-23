from django.urls import path
from .views import (
    UserRegistrationView, 
    UserLogoutView,
    CustomTokenObtainPairView,
    UserListView,
    UserDetailView,
    LoginActivityListView,
    AdminDashboardView,
    UserLoginHistoryView,
    UserProfileView,
    ChangePasswordView,
    UserCreateView
)

app_name = 'accounts'

urlpatterns = [
    # Authentication endpoints (public)
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/logout/', UserLogoutView.as_view(), name='logout'),

    # User endpoints (protected)
    path('user/login-history/', UserLoginHistoryView.as_view(), name='user-login-history'),

    # User profile management endpoints
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
    path('user/change-password/', ChangePasswordView.as_view(), name='change-password'),
    
    # Admin-only endpoints
    path('admin/users/', UserListView.as_view(), name='user-list'),
    path('admin/users/create/', UserCreateView.as_view(), name='user-create'),
    path('admin/users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('admin/login-activities/', LoginActivityListView.as_view(), name='login-activity-list'),
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
]