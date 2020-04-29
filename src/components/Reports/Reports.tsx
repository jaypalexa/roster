import AWS from 'aws-sdk';
import browserHistory from 'browserHistory';
import { useAppContext } from 'contexts/AppContext';
import useAuthentication from 'hooks/UseAuthentication';
import useMount from 'hooks/UseMount';
import React from 'react';
import './Reports.sass';

const Reports: React.FC = () => {
  // eslint-disable-next-line
  const [appContext, setAppContext] = useAppContext();
  const { getJwtToken } = useAuthentication();

  useMount(() => {
    const credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID || '',
      Logins: {
        [`cognito-idp.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID}`]: getJwtToken()
      }
    });
    
    AWS.config.update({
      region: process.env.REACT_APP_AWS_REGION,
      credentials: credentials
    });
    
    console.log('AWS.config', AWS.config);
  })

  const invokeLambda = async () => {

    // Content-Type: application/json
    // Accept: application/json

    interface RequestPayload {
      resource: string;             // ??? /root/child
      httpMethod: string;           // DELETE|GET|HEAD|OPTIONS|PATCH|POST|PUT
      headers: any;                 // { "headerName": "headerValue", ... }
      queryStringParameters: any;   // { "key": "value", ... }
      pathParameters: any;          // { "key": "value", ... }
      body?: string;
      // isBase64Encoded: boolean;     // true|false
    };

    interface ResponsePayload {
      statusCode: number;
      body: string;
    };

    const organizationId = appContext.organizationId;

    const requestPayload = {} as RequestPayload;
    requestPayload.resource = '/organizations/{organizationId}'
    requestPayload.httpMethod = 'GET'
    requestPayload.headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    requestPayload.pathParameters = { 'organizationId': organizationId }

    try {
      const params: AWS.Lambda.InvocationRequest = {
        FunctionName: 'roster-db-access-lambda', 
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(requestPayload),
      };

      const result = await (new AWS.Lambda().invoke(params).promise());
      console.log('result', result);
      console.log('result.StatusCode', result.StatusCode);
      console.log('result.Payload', result.Payload);
      const payload = JSON.parse(result.Payload?.toString() || '') as ResponsePayload;
      console.log('payload', payload);
      console.log('payload.body', payload.body);
    }
    catch (err) {
      console.log(err, err.stack);
    }
  }

  return (
    <div id='reports'>
      <div className='columns'>
        <div className='column has-text-centered'>
          <h1 className='title has-text-centered'>Reports</h1>
          <button className='button is-dark' onClick={() => browserHistory.push('/')}>Home</button>
          <h2 className='subtitle has-text-centered'>TEST</h2>
          <button className='button' onClick={invokeLambda}>TEST</button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
