import json

import sys
sys.path.append('..')

from util.responseBuilder import ResponseBuilder
from util.exceptionHandler import handle_exception
from model.order import OrderModel, OrderStatusEnum, TransactionStatusEnum

def checkOrderStatus(orderId):
    order = OrderModel.get(orderId)
    if order is None:
        raise Exception('order data does not exists!')
    
    result = {
        'orderStatus': order.orderStatus,
        'transactionStatus': order.transactionStatus
    }
    return result


@handle_exception
def handler(event, context):
    print(event)

    body = json.loads(event['body'])
    orderId = body['orderId']

    result = checkOrderStatus(orderId)

    return ResponseBuilder.success(data=result)