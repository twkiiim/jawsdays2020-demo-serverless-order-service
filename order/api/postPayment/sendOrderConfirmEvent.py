import boto3
import json

import sys
sys.path.append('..')

from model.order import OrderModel

def handler(event, context):
    orderId = event['orderId']

    order = OrderModel.get(orderId)

    if order is None:
        raise Exception('order data does not exists!')
    
    sqs = boto3.resource('sqs')
    queue = sqs.get_queue_by_name(QueueName='jawsdays2020_demo_order_queue')
    response = queue.send_message(MessageBody=json.dumps(order.to_dict()))

    if response.get('MessageId'):
        return 'sending order confirm event'
    else:
        raise Exception('error sending message to sqs queue.')
