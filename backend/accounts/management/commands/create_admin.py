from django.core.management.base import BaseCommand
from django.conf import settings
from accounts.models import User
import os

class Command(BaseCommand):
    help = 'Creates an admin user if none exists'

    def handle(self, *args, **kwargs):
        if not User.objects.filter(is_superuser=True).exists():
            admin_email = os.getenv('ADMIN_EMAIL', 'admin@example.com')
            admin_password = os.getenv('ADMIN_PASSWORD', 'ChangeMeImmediately123!')
            
            try:
                admin = User.objects.create_superuser(
                    email=admin_email,
                    password=admin_password,
                    username='admin'
                )
                self.stdout.write(self.style.SUCCESS(f'Admin user created with email: {admin_email}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Failed to create admin user: {str(e)}'))
        else:
            self.stdout.write(self.style.WARNING('Admin user already exists'))