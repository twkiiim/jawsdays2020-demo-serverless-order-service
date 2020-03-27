import traceback
from .responseBuilder import ResponseBuilder

def handle_exception(f):
    def func(*args, **kw):
        try:        
            return f(*args, **kw)
        except Exception as e:
            traceback.print_exc()
            return ResponseBuilder.error(error_msg=e)

    return func