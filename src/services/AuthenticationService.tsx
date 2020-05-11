import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserSession, IAuthenticationDetailsData, ICognitoUserData, ICognitoUserPoolData } from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';
import jwt_decode from 'jwt-decode';
import LoginModel from 'types/LoginModel';

const CLIENT_ID = process.env.REACT_APP_AWS_COGNITO_CLIENT_ID || '';
const IDENTITY_POOL_ID = process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID || '';
const USER_POOL_ID = process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID || '';
const REGION = process.env.REACT_APP_AWS_REGION || '';

const USER_POOL_DATA: ICognitoUserPoolData = {
  UserPoolId: USER_POOL_ID,
  ClientId: CLIENT_ID
};

const USER_POOL = new CognitoUserPool(USER_POOL_DATA);

const clearCachedCredentials = () => {
  const currentCredentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: IDENTITY_POOL_ID});
  currentCredentials.clearCachedId();
};

const getCurrentCognitoUser = (): CognitoUser | null => {
  return USER_POOL.getCurrentUser();
};

const getCurrentSessionPromise = (cognitoUser: CognitoUser) => {
  return new Promise<CognitoUserSession>((resolve, reject) => {
    cognitoUser.getSession((err: any, session: CognitoUserSession) => {
      if (err) {
        console.log('ERROR in AuthenticationService::getCurrentSessionPromise()::cognitoUser.getSession()', err);
        reject(err);
      } else {
        resolve(session);
      }
    });
  });
}

const getLastAuthUser = (): string => {
  return localStorage.getItem(`CognitoIdentityServiceProvider.${CLIENT_ID}.LastAuthUser`) || '';
};

const getAccessToken = (): string => {
  const lastAuthUser = getLastAuthUser();
  return localStorage.getItem(`CognitoIdentityServiceProvider.${CLIENT_ID}.${lastAuthUser}.accessToken`) || '';
};

export const AuthenticationService = {

  async authenticateUserAsync(login: LoginModel): Promise<boolean> {
    try {
      const authenticationDetailsData: IAuthenticationDetailsData = {
        Username: login.userName,
        Password: login.password
      };
      const authenticationDetails = new AuthenticationDetails(authenticationDetailsData);

      const cognitoUserData: ICognitoUserData = { 
        Username: login.userName, 
        Pool: USER_POOL 
      };
      const cognitoUser =  new CognitoUser(cognitoUserData);
    
      await new Promise<CognitoUserSession | any>((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: (session: CognitoUserSession) => {
            this.setConfigCredentials(session.getIdToken().getJwtToken());
            resolve();
          },
          onFailure: (err: any) => {
            console.log('ERROR in UseAuthentication::authenticateUserAsync()::cognitoUser.authenticateUser()', err);
            reject(err);
          }
        });
      });

      return true;
    }
    catch(err) {
      console.log('ERROR in UseAuthentication::authenticateUserAsync()', err);
      this.signOut();
      return false;
    }
  },

  getIdToken(): string {
    const lastAuthUser = getLastAuthUser();
    return localStorage.getItem(`CognitoIdentityServiceProvider.${CLIENT_ID}.${lastAuthUser}.idToken`) || '';
  },

  getOrganizationId(): string {
    const idToken = this.getIdToken();
    if (!idToken) return '';

    const decodedIdToken: any = jwt_decode(idToken);
    if (!decodedIdToken) return '';

    return decodedIdToken['custom:organizationId'];
  },

  getLoggedInUserName() {

    if (!this.isUserAuthenticated()) return '';

    const idToken = this.getIdToken();
    if (!idToken) return '';

    const decodedIdToken: any = jwt_decode(idToken);
    if (!decodedIdToken) return '';

    return decodedIdToken['cognito:username'] as string;
  },

  isTokenActive(): boolean {
    const idToken = this.getIdToken();
    if (!idToken) return false;

    const decodedIdToken: any = jwt_decode(idToken);
    if (!decodedIdToken) return false;

    const accessToken = getAccessToken();
    if (!accessToken) return false;

    const decodedAccessToken: any = jwt_decode(accessToken);
    if (!decodedAccessToken) return false;

    const now = (Date.now() / 1000);
    const isActive = ((now <= decodedIdToken?.exp) && (now <= decodedAccessToken?.exp)); // && (this.getUserName() === getLastAuthUser())
    return isActive;
  },

  isUserAuthenticated() {
    if (this.isTokenActive()) {
      this.setConfigCredentials(this.getIdToken());
      return true;
    } else {
      this.signOut();
      return false;
    }
  },

  async refreshSessionAsync() {
    console.log(`In refreshSessionAsync()...`);
    const currentCognitoUser = getCurrentCognitoUser();
    console.log(`refreshSessionAsync()::currentCognitoUser`, currentCognitoUser);
    if (currentCognitoUser) {
      const currentSession = await getCurrentSessionPromise(currentCognitoUser);
      console.log(`refreshSessionAsync()::currentSession`, currentSession);
      console.log(`refreshSessionAsync()::currentSession?.isValid()`, currentSession?.isValid());
      if (currentSession?.isValid()) {
        const refreshToken = currentSession.getRefreshToken();
        currentCognitoUser.refreshSession(refreshToken, (err: any, newSession: CognitoUserSession) => {
          if (err) {
            console.log('ERROR in AuthenticationService::refreshSessionAsync()::currentCognitoUser.refreshSession()', err);
          } 
          else {
            console.log(`refreshSessionAsync()::newSession`, newSession);
            console.log(`refreshSessionAsync()::newSession?.isValid()`, newSession?.isValid());
            if (newSession?.isValid()) {
              console.log('SESSION REFRESHED SUCCESSFULLY');
              this.setConfigCredentials(newSession.getIdToken().getJwtToken());
            }
          }
        });
      }
    }
  },
  
  setConfigCredentials(idToken: string) {
    clearCachedCredentials();
    
    AWS.config.region = REGION;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: IDENTITY_POOL_ID,
      Logins: {
        [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken
      }
    });
  },  

  signOut() {
    clearCachedCredentials();
    const currentCognitoUser = getCurrentCognitoUser();
    console.log('AuthenticationService::signOut::currentCognitoUser', currentCognitoUser);
    if (currentCognitoUser) {
      currentCognitoUser.signOut();
    }
  }
}

export default AuthenticationService;