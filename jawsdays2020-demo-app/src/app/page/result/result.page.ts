import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { PaymentService } from 'src/app/service/payment.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {

  orderId: string;
  
  intervalId;
  counter: number = 0;
  orderSucceededYn: boolean = false;
  orderFailedYn: boolean = false;

  loading: HTMLIonLoadingElement;

  constructor(
    private loadingController: LoadingController,
    private paymentService: PaymentService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.orderId = params.orderId;
    })
  }

  ngAfterViewInit() {
    this.presentLoading();

    this.intervalId = setInterval(this.checkOrderStatus.bind(this), 1000);
  }

  checkOrderStatus() {
    this.counter += 1;
    if( this.counter < 30 ) {
      this.paymentService.checkOrderStatus(this.orderId).subscribe(result => {
        console.log(result);
        if( result.transactionStatus > 0 ) {
          clearInterval(this.intervalId);
          result.orderStatus === 100 && (this.orderSucceededYn = true);
          result.orderStatus === 200 && (this.orderFailedYn = true);
          this.loading.dismiss();
        }
      })
    }
    else {
      clearInterval(this.intervalId);
      this.orderFailedYn = true;
      this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait.<br/>Purchase being processed ...',
    });
    await this.loading.present();
  }

  back() {
    this.router.navigate(['/list'])
  }
}
