from django.core.management.base import BaseCommand
from django.conf import settings
from accounts.models import User
import os
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Creates an admin user if none exists'

    def add_arguments(self, parser):
        parser.add_argument(
            '--no-input',
            action='store_true',
            help='Create admin user without user input',
        )

    def handle(self, *args, **options):
        if not User.objects.filter(is_superuser=True).exists():
            admin_email = os.getenv('ADMIN_EMAIL')
            admin_password = os.getenv('ADMIN_PASSWORD')

            if not admin_email or not admin_password:
                self.stdout.write(
                    self.style.ERROR('ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be set')
                )
                return

            try:
                admin = User.objects.create_superuser(
                    email=admin_email,
                    password=admin_password,
                    username='admin',
                    is_staff=True,
                    is_superuser=True
                )
                logger.info(f'Admin user created successfully: {admin_email}')
                self.stdout.write(
                    self.style.SUCCESS(f'Admin user created successfully: {admin_email}')
                )
            except Exception as e:
                logger.error(f'Failed to create admin user: {str(e)}')
                self.stdout.write(
                    self.style.ERROR(f'Failed to create admin user: {str(e)}')
                )
        else:
            self.stdout.write(
                self.style.WARNING('Admin user already exists')
            )