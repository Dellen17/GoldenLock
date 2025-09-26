from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Log headers and cookies for debugging
        logger.debug(f"Request Headers: {request.headers}")
        logger.debug(f"Request Cookies: {request.COOKIES}")

        raw_token = None

        # First try to get token from cookies
        if settings.SIMPLE_JWT['AUTH_COOKIE'] in request.COOKIES:
            raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
            logger.debug(f"Found token in cookies: {raw_token[:20]}...")
        
        if not raw_token:
            logger.warning("No token found in cookies")
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
            user = self.get_user(validated_token)
            logger.debug(f"Successfully authenticated user: {user.email}")
            return (user, validated_token)
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            return None