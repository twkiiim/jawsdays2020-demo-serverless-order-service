import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { Item } from '../interface/Item.interface';
import { map } from 'rxjs/operators';

declare let Stripe;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  stripe: any = null;

  constructor(
    private http: HttpClient,
  ) { }

  getStripeInstance() {
    if( !this.stripe ) {
      this.stripe = Stripe('pk_test_rxNxe90ymfrR59ybzGPaNRxq00jTv8kOQG');
    }
    
    return this.stripe;
  }

  getPaymentIntent(item: Item): Observable<any> {
    const url = 'API_GATEWAY_ENDPOINT_URL/start-order';
    const data = { item: item };

    return this.http.post(url, data).pipe( 
      map( result => {
        if( !result['error'] ) {
          return JSON.parse(result['data']);
        }
      }) 
    );
  }

  confirmPayment(paymentIntent: any, card: any) {
    if( !this.stripe ) { 
      console.error('[confirmPayment] Not allowed access');
      alert('Not allowed access!');
      return;
    }

    const self = this;
    const clientSecret = paymentIntent.client_secret;
    const metadata = paymentIntent.metadata;
    this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: 'Jenny Rosen'
        }
      }
    }).then(function(result) {
      if ( !result.error ) {
        if (result.paymentIntent.status === 'succeeded') {
          console.log('payment success!')
          console.log(result);

          result.paymentIntent.metadata = metadata;
          self.stripeManualWebhook(result.paymentIntent);
          
        }
        else {
          console.log(result.paymentIntent.status);
          alert('payment status: ' + result.paymentIntent.status);
        }
      } 
      else {
        console.log(result.error.message);
        alert(result.error.message);
      }
    });
  }

  stripeManualWebhook(paymentIntent: any) {
    const url = 'API_GATEWAY_ENDPOINT_URL/stripe-webhook';
    const data = {
      type: 'payment_intent.' + paymentIntent.status,
      data: {
        object: paymentIntent,
      }
    };

    console.log({data});

    this.http.post(url, data).subscribe(result => {
      console.log(result);
    })
  }

  checkOrderStatus(orderId: string): Observable<any> {
    const url = 'API_GATEWAY_ENDPOINT_URL/check-order-status';
    const data = {
      orderId: orderId
    };

    console.log({data})

    return this.http.post(url, data).pipe( 
      map( result => {
        if( !result['error'] ) {
          return JSON.parse(result['data']);
        }
      }) 
    );
  }
}
