import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync'

export class AppSyncClientConnector {

    private static appSyncClient: any;

    private constructor() {}

    public static getInstance() {
        if( this.appSyncClient == null ) {
            this.appSyncClient = new AWSAppSyncClient({
                url: 'APPSYNC_ENDPOINT',
                region: 'AWS_REGION',
                auth: {
                  type: AUTH_TYPE.API_KEY, //　you can use other auth services like Cognito or Auth0 as well.
                  apiKey: 'API_KEY',
                }
            });        
        }

        return this.appSyncClient;
    }
}