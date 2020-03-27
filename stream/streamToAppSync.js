'use strict';

require('isomorphic-fetch');
const AWSAppSyncClient = require('aws-appsync').default;
const gql = require('graphql-tag');

const mutation = gql(`mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input){
    id
    paymentId
    createdAt
    itemId
    title
    subtitle
    price
    expiresAt
  }
}`);

exports.handler = async (event, context) => {

  console.log(event)

  const url = 'APPSYNC_ENDPOINT';
  const region = 'AWS_REGION';
  const authType = 'API_KEY'; // this is constant. don't modify this value if you want to connect AppSync with API_KEY type.
  const apiKey = 'API_KEY';
 
  const appSyncClient = new AWSAppSyncClient({
    url: url,
    region: region,
    auth: {
      type: authType,
      apiKey: apiKey
    },
    disableOffline: true,
  });

  
  let order = JSON.parse(event['Records'][0]['body'])
  const orderInput = {
    id: order.id,
    paymentId: order.paymentId,
    createdAt: order.createdAt,
    itemId: order.itemId,
    title: order.title,
    subtitle: order.subtitle,
    price: order.price,
    expiresAt: Math.floor(Date.now() / 1000) + 60 // a minute later
  }

  const params = { input: orderInput };

  try {
    await appSyncClient.mutate({
      variables: params,
      mutation: mutation
    });
    console.log("success")
  } catch (err) {
    console.log(JSON.stringify(err));
  }
}