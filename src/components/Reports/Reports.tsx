import AWS from 'aws-sdk';
import browserHistory from 'browserHistory';
import useMount from 'hooks/UseMount';
import React from 'react';
import AuthenticationService from 'services/AuthenticationService';
import './Reports.sass';

const Reports: React.FC = () => {
  
  useMount(() => {
    const credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID || '',
      Logins: {
        [`cognito-idp.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID}`]: AuthenticationService.idToken.getJwtToken()
      }
    });
    
    AWS.config.update({
      region: process.env.REACT_APP_AWS_REGION,
      credentials: credentials
    });
    
    console.log('AWS.config', AWS.config);
  })

  const invokeLambda = async () => {
    try {
      const params: AWS.Lambda.InvocationRequest = {
        FunctionName: 'RosterDbAccessLambda', 
        Payload: JSON.stringify(AuthenticationService.idToken.getJwtToken()),
        // Payload: JSON.stringify({
        //   'x': 1, 
        //   'y': 2,
        //   'z': 3,
        // }),
      };

      const result = await (new AWS.Lambda().invoke(params).promise());
      console.log(result);
    }
    catch (err) {
      console.log(err);
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
