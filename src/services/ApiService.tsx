import AWS from 'aws-sdk';
import AuthenticationService from 'services/AuthenticationService';

export interface ApiRequestPayload {
  resource: string;             // ??? /root/child
  httpMethod: string;           // DELETE|GET|HEAD|OPTIONS|PATCH|POST|PUT
  headers: any;                 // { "headerName": "headerValue", ... }
  queryStringParameters?: any;  // { "key": "value", ... }
  pathParameters?: any;         // { "key": "value", ... }
  body?: string;
  // isBase64Encoded: boolean;     // true|false
};

export interface ApiResponsePayload {
  statusCode: number;
  body: ApiResponsePayloadBody;
};

export interface ApiResponsePayloadBody {
  data: any;
};

const initialize = () =>{
  const identityPoolId = process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID || '';
  const userPoolId = process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID || '';
  const region = process.env.REACT_APP_AWS_REGION || '';

  const currentCredentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: identityPoolId});
  currentCredentials.clearCachedId();

  const updatedCredentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId,
    Logins: {
      [`cognito-idp.${region}.amazonaws.com/${userPoolId}`]: AuthenticationService.getJwtToken()
    }
  });
  
  AWS.config.credentials = updatedCredentials;
  AWS.config.region = region;
  
  // console.log('AWS.config', AWS.config);
}

// TODO: CACHING ???
// interface CACHE_MODEL {
//   [key: string]: any;
// }

export const ApiService = {

  // TODO: CACHING ???
  // CACHE: {} as CACHE_MODEL,
  // getCacheValue(key: string) {
  //   return this.CACHE[key];
  // },
  // setCacheValue(key: string, value: any) {
  //   return this.CACHE[key] = value;
  // },
  
  async wakeup() {
    AWS.config.region = process.env.REACT_APP_AWS_REGION || '';

    const accessKeyId = process.env.REACT_APP_AWS_USER_ACCESS_KEY_ID_FOR_ROSTER_WAKEUP_USER || '';
    const secretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY_FOR_ROSTER_WAKEUP_USER || '';
    AWS.config.credentials = new AWS.Credentials(accessKeyId, secretAccessKey);

    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = '/wakeup';

    const params: AWS.Lambda.InvocationRequest = {
      FunctionName: 'roster-db-access-lambda', 
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify(apiRequestPayload),
    };

    // console.log('params', params);
    // const result = await (new AWS.Lambda().invoke(params).promise());
    // console.log('result', result);

    new AWS.Lambda().invoke(params)
  },

  async execute(apiRequestPayload: ApiRequestPayload): Promise<any> {

    initialize();

    const headers = {
      'jwt': AuthenticationService.getJwtToken(), // AWS Lambda will parse jwt to get 'custom:organizationId' attribute
      'Content-Type': 'application/json', 
      'Accept': 'application/json' 
    }

    apiRequestPayload.headers = { ...apiRequestPayload.headers, ...headers };

    try {
      const params: AWS.Lambda.InvocationRequest = {
        FunctionName: 'roster-db-access-lambda', 
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(apiRequestPayload),
      };

      // console.log('params', params);
      const result = await (new AWS.Lambda().invoke(params).promise());
      // console.log('result', result);
      // console.log('result.StatusCode', result.StatusCode);
      // console.log('result.Payload', result.Payload);
      const payload = JSON.parse(result.Payload?.toString() || '') as ApiResponsePayload;
      // console.log('payload', payload);
      // console.log('payload.body', payload.body);
      // console.log('payload.body.data', payload.body?.data);

      let response = {};
      if (apiRequestPayload.httpMethod === 'GET') {
        response = JSON.parse(payload.body?.data);
      }
      return response;
    }
    catch (err) {
      console.log(err, err.stack);
      return null;
    }
  }

}

export default ApiService;