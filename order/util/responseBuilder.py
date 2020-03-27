import json
from datetime import datetime


class ResponseBuilder:
    @staticmethod
    def success(data={}):
        body = {}
        body['error'] = 0
        body['data'] = json.dumps(data)

        resp = {}
        resp['statusCode'] = 200
        resp['headers'] = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*'
        }
        resp['body'] = json.dumps(body)
        print(resp)

        return resp

    @staticmethod
    def error(error_msg='error'):
        body = {}
        body['error'] = 1
        body['error_msg'] = str(error_msg)

        resp = {}
        resp['statusCode'] = 500
        resp['headers'] = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*'
        }
        resp['body'] = json.dumps(body)

        return resp