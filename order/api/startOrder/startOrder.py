import json
import stripe

import sys
sys.path.append('..')

from util.responseBuilder import ResponseBuilder
from util.exceptionHandler import handle_exception
from model.order import OrderModel

stripe.api_key = 'sk_test_vMra7VjK8wMO6WQVqoA1lA0l005aYAjFwK'

def startOrder(item):

    order = OrderModel()
    order.init()

    paymentIntent = stripe.PaymentIntent.create(
      amount=1099,
      currency='jpy',
      metadata={
        'orderId': str(order.id),
      },
    )
    
    order.paymentId = paymentIntent.id
    order.itemId = item['id']
    order.title = item['title']
    order.subtitle = item['subtitle']
    order.price = item['price']
    order.save()

    result = {}
    result['paymentIntent'] = paymentIntent
    result['order'] = order.to_dict()

    return result


@handle_exception
def handler(event, context):
    print(event)

    body = json.loads(event['body'])
    item = body['item']

    result = startOrder(item)

    return ResponseBuilder.success(data=result)
