import logging

logger = logging.getLogger(__name__)

class CookieDebugMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        logger.info(f"Request cookies: {request.COOKIES}")
        logger.info(f"Request headers: {request.headers}")
        
        response = self.get_response(request)
        
        logger.info(f"Response cookies: {response.cookies}")
        logger.info(f"Response headers: {dict(response.headers)}")
        
        return response