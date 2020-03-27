import stripe

stripe.api_key = 'sk_test_vMra7VjK8wMO6WQVqoA1lA0l005aYAjFwK'


def handler(event, context):
    print(event)

    paymentId = event['paymentId']
    
    refund = stripe.Refund.create(
      payment_intent=paymentId,
    )

    print(refund)

    if refund.status == 'succeeded':
      return 'payment cancelled'
    
    else:
      raise Exception('payment refund error')