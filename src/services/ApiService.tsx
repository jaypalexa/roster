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
    apiRequestPayload.resource = '/wake-up';

    const params: AWS.Lambda.InvocationRequest = {
      FunctionName: 'roster-api-lambda', 
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify(apiRequestPayload),
    };

    console.log('WAKE-UP params', params);
    const result = await (new AWS.Lambda().invoke(params).promise());
    console.log('WAKE-UP result', result);

    // new AWS.Lambda().invoke(params)
  },

  async execute(apiRequestPayload: ApiRequestPayload): Promise<any> {

    try {
      const isUserAuthenticated = AuthenticationService.isUserAuthenticated();
      if (!isUserAuthenticated) {
        throw new Error('ApiService::execute::User not authenticated');
      }
      
      const headers = {
        'jwt': AuthenticationService.getIdToken(), // AWS Lambda will parse jwt to get 'custom:organizationId' attribute
        'Content-Type': 'application/json', 
        'Accept': 'application/json' 
      }

      apiRequestPayload.headers = { ...apiRequestPayload.headers, ...headers };

      const params: AWS.Lambda.InvocationRequest = {
        FunctionName: 'roster-api-lambda', 
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(apiRequestPayload),
      };

      console.log('params', params);
      const result = await (new AWS.Lambda().invoke(params).promise());
      console.log('result', result);

      const statusCode = result.StatusCode || 0;
      if (statusCode < 200 || 299 < statusCode) {
        throw new Error(`HTTP status code of ${statusCode} indicates an unsuccessful request`);
      }
      
      // console.log('result.Payload', result.Payload);
      const payload = JSON.parse(result.Payload?.toString() || '') as ApiResponsePayload;
      const data = payload.body?.data;
      console.log('data', data);
      
      return data;
    }
    catch (err) {
      console.log(err, err.stack);
      throw err;
    }
  },

  async get<T>(apiRequestPayload: ApiRequestPayload): Promise<T> {
    apiRequestPayload.httpMethod = 'GET';
    const response = await this.execute(apiRequestPayload);
    return JSON.parse(response) as T;
  },

  async getMany<T>(apiRequestPayload: ApiRequestPayload): Promise<T[]> {
    apiRequestPayload.httpMethod = 'GET';
    const response = (await this.execute(apiRequestPayload)) || [];
    return (response.length > 0 ? response.map((x: string) => JSON.parse(x) as T) : []);
  },

  async save<T>(apiRequestPayload: ApiRequestPayload, body: T): Promise<any> {
    apiRequestPayload.httpMethod = 'PUT';
    apiRequestPayload.body = JSON.stringify(body);

    const response = await this.execute(apiRequestPayload);
    return response;
  },

  async delete(apiRequestPayload: ApiRequestPayload): Promise<any> {
    apiRequestPayload.httpMethod = 'DELETE';
    const response = await this.execute(apiRequestPayload);
    return response;
  },
}

export default ApiService;