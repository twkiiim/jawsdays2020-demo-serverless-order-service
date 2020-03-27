import sys
sys.path.append('..')

from util.responseBuilder import ResponseBuilder
from util.exceptionHandler import handle_exception
from model.order import OrderModel, OrderStatusEnum, TransactionStatusEnum

def handler(event, context):
    orderId = event['orderId']
    
    order = OrderModel.get(orderId)

    if order is None:
        raise Exception('order data does not exists!')
    
    else:
        order.update(actions=[
            OrderModel.orderStatus.set(OrderStatusEnum.FAILED),
            OrderModel.transactionStatus.set(TransactionStatusEnum.DONE)
        ])
        return 'order failed'