import AWS from 'aws-sdk';
import browserHistory from 'browserHistory';
import AuthenticationService from 'services/AuthenticationService';

export interface ApiRequestPayload {
  resource: string;             // ??? /root/child
  httpMethod: string;           // DELETE|GET|HEAD|OPTIONS|PATCH|POST|PUT
  headers: any;                 // { "headerName": "headerValue", ... }
  queryStringParameters?: any;  // { "key": "value", ... }
  pathParameters?: any;         // { "key": "value", ... }
  body?: any;
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
interface CACHE_MODEL {
  [key: string]: any;
}

export const ApiService = {

  // TODO: CACHING ???
  CACHE: {} as CACHE_MODEL,
  getCacheValue(key: string) {
    return this.CACHE[key];
  },
  setCacheValue(key: string, value: any) {
    return this.CACHE[key] = value;
  },
  RESOURCE_LAST_UPDATE: '/last-update',
  
  async needDataRefresh(): Promise<boolean> {
    const organizationId = AuthenticationService.getOrganizationId();

    const apiRequestPayload = {} as ApiRequestPayload;
    apiRequestPayload.resource = this.RESOURCE_LAST_UPDATE;
    apiRequestPayload.pathParameters = { organizationId: organizationId };

    const localLastUpdate = Number(localStorage.getItem(`${organizationId}#lastUpdate`));
    const serverLastUpdate = await this.get<number>(apiRequestPayload);

    console.log('localLastUpdate', localLastUpdate);
    console.log('serverLastUpdate', serverLastUpdate);
    
    if (localLastUpdate !== serverLastUpdate) {
      localStorage.setItem(`${organizationId}#lastUpdate`, serverLastUpdate.toString());
      return true;
    }

    return false;
  },

  async execute(apiRequestPayload: ApiRequestPayload): Promise<any> {

    try {
      if (!AuthenticationService.isUserAuthenticated()) {
        browserHistory.push('/login');
        console.log('ERROR: User not authenticated');
        Promise.reject({});
      }

      AuthenticationService.updateUserActivity();
      
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

      console.log('ApiService.execute()::params', params);
      const response = await (new AWS.Lambda().invoke(params).promise());
      console.log('ApiService.execute()::response', response);

      const statusCode = response.StatusCode || 0;
      if (statusCode < 200 || 299 < statusCode) {
        throw new Error(`ERROR: HTTP status code ${statusCode} indicates an unsuccessful request`);
      }

      if (response.FunctionError) {
        throw new Error(`ERROR: FunctionError '${response.FunctionError}':  ${response.Payload}`);
      }
      
      const payload = JSON.parse(response.Payload?.toString() || '') as ApiResponsePayload;
      const data = payload.body?.data;
      console.log('ApiService.execute()::data', data);
      
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
    return response as T;
  },

  async getMany<T>(apiRequestPayload: ApiRequestPayload): Promise<T[]> {
    apiRequestPayload.httpMethod = 'GET';
    const response = (await this.execute(apiRequestPayload)) || [];
    return response as T[];
  },

  async save<T>(apiRequestPayload: ApiRequestPayload, body: T): Promise<any> {
    apiRequestPayload.httpMethod = 'PUT';
    apiRequestPayload.body = body;
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