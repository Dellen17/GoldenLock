from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone

# Custom Manager for the Custom User Model
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and return a regular user with an email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password) # This hashes the password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and return a superuser with an email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'admin') # Superusers are implicitly admins

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

# Custom User Model
class User(AbstractBaseUser, PermissionsMixin):
    # Choices for the role field
    class Role(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        USER = 'user', 'User'

    # Core Fields
    email = models.EmailField(unique=True, max_length=255)
    username = models.CharField(max_length=150, unique=True, blank=True, null=True) # Optional

    # Custom Fields
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.USER)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Django necessary fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False) # Needed for admin access

    # Tells Django to use the 'email' field as the unique identifier instead of 'username'
    USERNAME_FIELD = 'email'
    # Email & Password are required by default. Add any other required fields here.
    REQUIRED_FIELDS = [] 

    # Use the custom manager for this model
    objects = CustomUserManager()

    def __str__(self):
        return self.email

    # Helper method to check if a user is an admin
    def is_admin(self):
        return self.role == self.Role.ADMIN or self.is_superuser

# Model to track login activities
class LoginActivity(models.Model):
    """
    Model to track successful user login attempts.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_activities')
    ip_address = models.GenericIPAddressField()
    timestamp = models.DateTimeField(default=timezone.now)
    
    class Meta:
        verbose_name_plural = "Login Activities"
        ordering = ['-timestamp']  # Most recent first
    
    def __str__(self):
        return f"{self.user.email} - {self.ip_address} - {self.timestamp}"    