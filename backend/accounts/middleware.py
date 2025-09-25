import logging

logger = logging.getLogger(__name__)

class DebugRequestMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        logger.info(f'Request Cookies: {request.COOKIES}')
        logger.info(f'Request Headers: {dict(request.headers)}')
        
        response = self.get_response(request)
        
        logger.info(f'Response Cookies: {response.cookies}')
        logger.info(f'Response Headers: {dict(response.headers)}')
        
        return response