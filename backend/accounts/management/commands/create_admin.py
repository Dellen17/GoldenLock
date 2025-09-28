from django.core.management.base import BaseCommand
from django.conf import settings
from accounts.models import User
import os
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Creates an admin user if none exists'

    def handle(self, *args, **options):
        admin_email = os.getenv('ADMIN_EMAIL')
        admin_password = os.getenv('ADMIN_PASSWORD')

        if not admin_email or not admin_password:
            logger.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set")
            return

        try:
            # Check if admin exists
            admin = User.objects.filter(email=admin_email).first()
            
            if admin:
                # Update existing admin's password
                admin.set_password(admin_password)
                admin.save()
                logger.info(f"Updated password for existing admin: {admin_email}")
                self.stdout.write(self.style.SUCCESS(f"Updated admin password: {admin_email}"))
            else:
                # Create new admin
                admin = User.objects.create_superuser(
                    email=admin_email,
                    password=admin_password,
                    username='admin',
                    role='admin'
                )
                logger.info(f"Created new admin user: {admin_email}")
                self.stdout.write(self.style.SUCCESS(f"Created admin user: {admin_email}"))

        except Exception as e:
            logger.error(f"Failed to create/update admin: {str(e)}")
            self.stdout.write(self.style.ERROR(f"Failed to create/update admin: {str(e)}"))