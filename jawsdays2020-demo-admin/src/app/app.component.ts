import { Component } from '@angular/core';
import { AppSyncClientConnector } from './appsync.connector';

import gql from 'graphql-tag';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() { }

  items = [];

  appSyncClient = null;

  ngOnInit() {
    this.appSyncClient = AppSyncClientConnector.getInstance();
    
    const subscribeOrder = gql`
      subscription onCreateOrder {
        onCreateOrder {
          id
          paymentId
          createdAt
          itemId
          title
          subtitle
          price
          expiresAt
        }
      }
    `;

    let subscription;
    let self = this;

    (async () => {
      subscription = this.appSyncClient.subscribe({ query: subscribeOrder }).subscribe({
        next: data => {
          const item = data.data.onCreateOrder;
          self.items.push(item);
        },
        error: error => {
          console.warn(error);
        }
      });
    })();

  }

}
