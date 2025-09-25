from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings

class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        
        # First try to get the token from cookies
        if not header:
            raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE']) or None
            if raw_token:
                header = self.get_raw_token(raw_token.encode())
        
        if not header:
            return None

        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token