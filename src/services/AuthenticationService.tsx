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
  authenticateUser(login: LoginModel) {
    
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
  },
  signOut(userName: string | undefined) {
    if (!userName) return;

    const cognitoUserData = {
      Username: userName,
      Pool: cognitoUserPool
    };

    const cognitoUser = new CognitoUser(cognitoUserData);
    cognitoUser.signOut();
  }
};

export default AuthenticationService;
