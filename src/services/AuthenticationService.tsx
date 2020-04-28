import { AuthenticationDetails, CognitoIdToken, CognitoUser, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import LoginModel from 'types/LoginModel';

const POOL_DATA = {
  UserPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID || '',
  ClientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID || ''
};

const cognitoUserPool = new CognitoUserPool(POOL_DATA);

const AuthenticationService = {
  isAuthenticated: false,
  idToken: {} as CognitoIdToken,
  authenticate(login: LoginModel) {
    
    const cognitoUserData = {
      Username: login.userName,
      Pool: cognitoUserPool
    };

    const cognitoUser = new CognitoUser(cognitoUserData);

    const authenticationDetailsData = {
      Username: login.userName,
      Password: login.password
    };

    const authenticationDetails = new AuthenticationDetails(authenticationDetailsData);

    return new Promise<CognitoUserSession | any>((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: resolve,
        onFailure: reject
      });
    });

    // // Initialize the Amazon Cognito credentials provider
    // AWS.config.region = 'us-east-2'; // Region
    // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    //     IdentityPoolId: 'us-east-2:d31ad047-d7bf-445d-9d34-56426e5a7096',
    // });
    // // Add the User's Id Token to the Cognito credentials login map.
    // AWS.config.region = 'us-east-2';
    // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    //   IdentityPoolId: 'YOUR_IDENTITY_POOL_ID',
    //   Logins: {
    //     'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>': result.getIdToken().getJwtToken()
    //   }
    // });

    // /*
    // * Import the SDK and Project Configuration
    // */
    // import AWS from 'aws-sdk';
    // import awsmobile from './aws-exports';

    // /*
    // * Configure the SDK to use anonymous identity 
    // */
    // AWS.config.update({
    //   region: awsmobile.aws_cognito_region,
    //   credentials: new AWS.CognitoIdentityCredentials({
    //     IdentityPoolId: awsmobile.aws_cognito_identity_pool_id
    //   })
    // });

    // cognitoUser.authenticateUser(authenticationDetails, {
    //   onSuccess: (result: CognitoUserSession | any) => {
    //     // setLoading(false);
    //     // setUsername(email);
    //     // setTimestamp(+result.idToken.payload["custom:timestamp"] || 0);
    //     // setAuthStatus({
    //     //   userId: result.idToken.payload.sub,
    //     //   idToken: result.idToken.jwtToken,
    //     //   timestamp: +result.idToken.payload["custom:timestamp"] || 0,
    //     //   authenticated: true,
    //     // });
    //     // history.push("/home");  // or whatever route you want a signed in user to be redirected to

    //     this.isAuthenticated = true;
    //     this.loggedInUserName = login.userName;
    //   },
    //   onFailure: (err) => {
    //     // setLoading(false);
    //     console.log(err.message);

    //     this.isAuthenticated = false;
    //     this.loggedInUserName = '';
    //   },
    // });

    // if (login.userName === 'stinky') { //TODO: DO REAL AUTHENTICATION HERE
    //   this.isAuthenticated = true;
    //   this.loggedInUserName = login.userName;
    // } else {
    //   this.isAuthenticated = false;
    //   this.loggedInUserName = '';
    // }

    // setTimeout(cb, 100);
  },
  // signout(cb: (...args: any[]) => void) { 
  //   this.isAuthenticated = false; 
  //   this.loggedInUserName = ''; 
  //   setTimeout(cb, 100); 
  // }
};

export default AuthenticationService;
