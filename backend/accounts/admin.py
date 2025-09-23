from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, LoginActivity

# Customize the admin interface for the User model
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('email', 'username', 'role', 'is_staff', 'is_active', 'created_at')
    list_filter = ('role', 'is_staff', 'is_active', 'created_at')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('username',)}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'created_at', 'updated_at')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active', 'role')}
        ),
    )
    search_fields = ('email', 'username')
    ordering = ('-created_at',) # Newest users first
    readonly_fields = ('created_at', 'updated_at') # Make timestamps read-only

# Customize the admin interface for the LoginActivity model
class LoginActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'ip_address', 'timestamp')
    list_filter = ('timestamp', 'ip_address')
    search_fields = ('user__email', 'user__username', 'ip_address')
    readonly_fields = ('user', 'ip_address', 'timestamp')  # Make all fields read-only

# Register the custom user model and LoginActivity model with the admin site
admin.site.register(User, CustomUserAdmin)
admin.site.register(LoginActivity, LoginActivityAdmin)