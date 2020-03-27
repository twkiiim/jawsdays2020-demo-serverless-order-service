import random

def handler(event, context):

    randVal = random.random()
    if randVal > 0.01:
        return 'delivery successfully requested!'
    else:
        raise Exception('delivery request (randomly) failed')

    