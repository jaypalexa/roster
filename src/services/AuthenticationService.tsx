import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';
import jwt_decode from 'jwt-decode';
import LoginModel from 'types/LoginModel';

const clientId = process.env.REACT_APP_AWS_COGNITO_CLIENT_ID || '';
const identityPoolId = process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID || '';
const userPoolId = process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID || '';
const region = process.env.REACT_APP_AWS_REGION || '';

const POOL_DATA = {
  UserPoolId: userPoolId,
  ClientId: clientId
};

const cognitoUserPool = new CognitoUserPool(POOL_DATA);

const getCurrentCognitoUser = (): CognitoUser | null => {
  return cognitoUserPool.getCurrentUser();
}

const setCognitoUser = (userName: string): CognitoUser  => {
  const cognitoUserData = { Username: userName, Pool: cognitoUserPool };
  return new CognitoUser(cognitoUserData);
}

const doAuthenticateUser = (login: LoginModel) => {
  const authenticationDetailsData = {
    Username: login.userName,
    Password: login.password
  };
  const authenticationDetails = new AuthenticationDetails(authenticationDetailsData);
  const cognitoUser = setCognitoUser(login.userName);

  return new Promise<CognitoUserSession | any>((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: resolve,
      onFailure: reject,
      newPasswordRequired: resolve
    });
  });
}

const clearCurrentCredentials = () => {
  const currentCredentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: identityPoolId});
  currentCredentials.clearCachedId();
}

export const AuthenticationService = {

  async authenticateUser(login: LoginModel): Promise<boolean> {
    try {
      await doAuthenticateUser(login);
      await this.refreshCredentials();
      return true;
    }
    catch(err) {
      console.log('ERROR in UseAuthentication::authenticateUser()', err);
      clearCurrentCredentials();
      return false;
    }
  },

  getJwtIdToken(): string {
    const lastAuthUser = this.getLastAuthUser();
    return localStorage.getItem(`CognitoIdentityServiceProvider.${clientId}.${lastAuthUser}.idToken`) || '';
  },

  getJwtRefreshToken(): string {
    const lastAuthUser = this.getLastAuthUser();
    return localStorage.getItem(`CognitoIdentityServiceProvider.${clientId}.${lastAuthUser}.refreshToken`) || '';
  },

  getLastAuthUser(): string {
    return localStorage.getItem(`CognitoIdentityServiceProvider.${clientId}.LastAuthUser`) || '';
  },

  getTokenOrganizationId(): string {
    const token = this.getJwtIdToken();
    if (!token) return '';
    const decodedToken: any = jwt_decode(token);
    if (!decodedToken) return '';

    return decodedToken['custom:organizationId'];
  },

  getTokenUserName(): string {
    const token = this.getJwtIdToken();
    if (!token) return '';
    const decodedToken: any = jwt_decode(token);
    if (!decodedToken) return '';
    
    return decodedToken['cognito:username'];
  },

  isUserAuthenticated(): boolean {
    try {
      const idToken = this.getJwtIdToken();
      if (!idToken) return false;
      const decodedIdToken: any = jwt_decode(idToken);
      if (!decodedIdToken) return false;

      const userName = decodedIdToken['cognito:username'];

      if ((Date.now() / 1000 <= decodedIdToken.exp) && (userName === this.getLastAuthUser())) {
        this.refreshSession();
        return true;
      } else {
        this.signOut();
        return false;
      }
    }
    catch(err) {
      console.log('ERROR in AuthenticationService::isUserAuthenticated', err);
      return false;
    }
  },

  refreshCredentials() {
    return new Promise<void>((resolve, reject) => {
      clearCurrentCredentials();
    
      const credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId,
        Logins: {
          [`cognito-idp.${region}.amazonaws.com/${userPoolId}`]: this.getJwtIdToken()
        }
      });
      
      AWS.config.credentials = credentials;
      AWS.config.region = region;

      credentials.refresh(err => {
        if (err) {
          console.log('ERROR in AuthenticationService::refreshCredentials::credentials.refresh', err);
          reject();
        } else {
          resolve();
        }
      });
    });
  },  

  async refreshSession() {
    return await new Promise<void>((resolve, reject) => {
      const cognitoUser = getCurrentCognitoUser();
      if (cognitoUser != null) { 
        cognitoUser.getSession(async (err: any, session: CognitoUserSession) => {
          if (err) {
            console.log('ERROR in AuthenticationService::refreshSession::cognitoUser.getSession', err);
            resolve();
          } else {
            if (session && session.isValid()) {
              if (!AWS.config.credentials) {
                await this.refreshCredentials();
              }
              const credentials = AWS.config.credentials as AWS.CognitoIdentityCredentials;
              // console.log('credentials?.needsRefresh()', credentials?.needsRefresh());
              if (credentials?.needsRefresh()) {
                const refreshToken = session.getRefreshToken();
                cognitoUser.refreshSession(refreshToken, async (err: any, session: CognitoUserSession) => {
                  if (err) {
                    console.log('ERROR in AuthenticationService::refreshSession::cognitoUser.refreshSession', err);
                    resolve();
                  } else {
                    // console.log('SESSION REFRESHED SUCCESSFULLY');
                    resolve();
                  }
                });
              } else {
                resolve();
              }
            } else {
              resolve();
            }
          }
        })
      } else {
        resolve();
      }
    });
  },

  signOut() {
    clearCurrentCredentials();
    getCurrentCognitoUser()?.signOut();
  }
}

export default AuthenticationService;