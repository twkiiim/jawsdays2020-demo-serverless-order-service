import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from 'src/app/interface/Item.interface';
import { ItemService } from 'src/app/service/item.service';
import { PaymentService } from 'src/app/service/payment.service';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  item: Item = null;
  card: any = null;

  constructor(
    private itemService: ItemService,
    private paymentService: PaymentService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.fetchItem();
  }

  ngAfterViewInit() {
    if( this.item ) {
      this.initStripe();
    }
  }

  fetchItem() {
    this.route.queryParams.subscribe(params => {
      const itemId = parseInt(params.itemId);
      
      this.itemService.getItem(itemId).subscribe( item => {
        this.item = item;
      })
    })
  }

  initStripe() {
    let stripe = this.paymentService.getStripeInstance();

    var elements = stripe.elements();
    var style = {
      base: {
        color: "#32325d",
      }
    };

    this.card = elements.create("card", { style: style });
    this.card.mount("#card-element");
    
    this.card.addEventListener('change', ({error}) => {
      const displayError = document.getElementById('card-errors');
      if (error) {
        displayError.textContent = error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }
  
  payment() {
    let order;
    let paymentIntent;

    const pi = this.paymentService.getPaymentIntent(this.item).pipe(
      map(
        result => {
          order = result.order;
          paymentIntent = result.paymentIntent;
      
          console.log(order);
          console.log(paymentIntent.client_secret);

          return paymentIntent;
        },
        error => {
          console.error(error);
          alert('There was an error creating your payment intent.');
        }
      ),
      switchMap(paymentIntent =>
        of(this.paymentService.confirmPayment(paymentIntent, this.card))
      )
    );

    pi.subscribe(() => {
      this.next(order.id);
    });
  }

  before() {
    this.router.navigate(['/list']);
  }

  next(orderId: string) {
    this.router.navigate(['/result'], { queryParams: { orderId: orderId }});
  }

}
