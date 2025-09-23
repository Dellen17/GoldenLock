from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User
from .models import LoginActivity
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Handles the creation of a new user.
    """
    # Ensure the password is at least 8 characters long and write-only (not returned in the response)
    password = serializers.CharField(max_length=128, min_length=8, write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'role')
        # We don't want the role to be required on registration, default to 'user'
        extra_kwargs = {'role': {'required': False}}

    def create(self, validated_data):
        # Use the CustomUserManager's create_user method to handle password hashing
        return User.objects.create_user(**validated_data)

class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    """
    email = serializers.EmailField()
    password = serializers.CharField(max_length=128, write_only=True)
    username = serializers.CharField(read_only=True)
    role = serializers.CharField(read_only=True)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)

    def validate(self, data):
        """
        Validate user credentials and return the user and tokens if successful.
        """
        email = data.get('email', None)
        password = data.get('password', None)

        # Authenticate the user using Django's built-in authentication
        user = authenticate(username=email, password=password)

        if user is None:
            raise serializers.ValidationError('Invalid credentials. Please try again.')

        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')

        # Import JWT token generation functions here to avoid circular imports
        from rest_framework_simplejwt.tokens import RefreshToken

        # Generate JWT tokens for the user
        refresh = RefreshToken.for_user(user)
        tokens = {
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }

        # Return all the data we want in the response
        return {
            'email': user.email,
            'username': user.username,
            'role': user.role,
            **tokens
        }
    
# Admin and read-only serializers
class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model (read-only for admin endpoints).
    """
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'role', 'is_active', 
                 'is_staff', 'created_at', 'updated_at', 'last_login')
        read_only_fields = ('id', 'created_at', 'updated_at', 'last_login')

class LoginActivitySerializer(serializers.ModelSerializer):
    """
    Serializer for LoginActivity model.
    """
    user_email = serializers.EmailField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = LoginActivity
        fields = ('id', 'user_email', 'username', 'ip_address', 'timestamp')
        read_only_fields = ('id', 'user_email', 'username', 'ip_address', 'timestamp')

# User profile and password change serializers
class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile updates (excludes sensitive fields).
    """
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())],
        required=False
    )

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'role', 'created_at', 'updated_at')
        read_only_fields = ('id', 'role', 'created_at', 'updated_at')

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        return instance

class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=8)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        """
        Validate that the new passwords match and the old password is correct.
        """
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("New passwords do not match.")
        
        # Validate password strength
        validate_password(data['new_password'])
        
        return data

    def validate_old_password(self, value):
        """
        Validate that the old password is correct.
        """
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value