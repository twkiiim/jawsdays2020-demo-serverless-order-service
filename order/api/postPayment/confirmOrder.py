import sys
sys.path.append('..')

from model.order import OrderModel, OrderStatusEnum

def handler(event, context):
    print(event)

    orderId = event['orderId']
    order = OrderModel.get(orderId)

    if order is None:
        raise Exception('order data does not exists!')
    
    else:
        order.update(actions=[
            OrderModel.orderStatus.set(OrderStatusEnum.SUCCEEDED)
        ])
        return 'order successfully confirmed.'