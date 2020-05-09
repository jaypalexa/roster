import { AuthenticationDetails, CognitoRefreshToken, CognitoUser, CognitoUserPool, CognitoUserSession, IAuthenticationDetailsData, ICognitoUserData, ICognitoUserPoolData } from 'amazon-cognito-identity-js';
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

const getLastAuthUser = (): string => {
  return localStorage.getItem(`CognitoIdentityServiceProvider.${CLIENT_ID}.LastAuthUser`) || '';
};

const getAccessToken = (): string => {
  const lastAuthUser = getLastAuthUser();
  return localStorage.getItem(`CognitoIdentityServiceProvider.${CLIENT_ID}.${lastAuthUser}.accessToken`) || '';
};

export const AuthenticationService = {

  async authenticateUser(login: LoginModel): Promise<boolean> {
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
            console.log('ERROR in UseAuthentication::authenticateUser::cognitoUser.authenticateUser', err);
            reject(err);
          }
        });
      });

      return true;
    }
    catch(err) {
      console.log('ERROR in UseAuthentication::authenticateUser', err);
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

  getUserName(): string {
    const idToken = this.getIdToken();
    if (!idToken) return '';

    const decodedIdToken: any = jwt_decode(idToken);
    if (!decodedIdToken) return '';

    return decodedIdToken['cognito:username'];
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

  isUserAuthenticated(): boolean {
    try {
      if (this.isTokenActive()) {
        console.log('isUserAuthenticated::isTokenActive === TRUE');
        this.setConfigCredentials(this.getIdToken());
        return true;
      } else {
        console.log('isUserAuthenticated::isTokenActive === FALSE');
        this.refreshSession();
        if (this.isTokenActive()) {
          console.log('isUserAuthenticated::isTokenActive::post-refreshSession === TRUE');
          return true;
        } else {
          console.log('isUserAuthenticated::isTokenActive::post-refreshSession === FALSE');
          this.signOut();
          return false;
        }
      }
    }
    catch(err) {
      console.log('ERROR in AuthenticationService::isUserAuthenticated', err);
      return false;
    }
  },

  async refreshSession() {
    console.log('In refreshSession()...');
    const currentCognitoUser = getCurrentCognitoUser();
    console.log('refreshSession::currentCognitoUser', currentCognitoUser);
    if (currentCognitoUser) { 
        const currentSession = currentCognitoUser.getSignInUserSession();
        console.log('refreshSession::currentSession', currentSession);
        if (currentSession && currentSession.isValid) {
          console.log('refreshSession::AWS.config.credentials', AWS.config.credentials);
          if (!AWS.config.credentials) {
            this.setConfigCredentials(currentSession.getIdToken().getJwtToken());
          }
          const credentials = AWS.config.credentials as AWS.CognitoIdentityCredentials;
          console.log('refreshSession::credentials', credentials);
          console.log('refreshSession::credentials?.needsRefresh()', credentials?.needsRefresh());
          if (credentials?.needsRefresh()) {
            const refreshToken = currentSession.getRefreshToken();
            await this.doRefresh(currentCognitoUser, refreshToken);
          } 
        } 
    }
  },

  doRefresh(currentCognitoUser: CognitoUser, refreshToken: CognitoRefreshToken) {
    return new Promise<void>((resolve, reject) => {
      currentCognitoUser.refreshSession(refreshToken, (err: any, newSession: CognitoUserSession) => {
        if (err) {
          console.log('ERROR in AuthenticationService::refreshSession::cognitoUser.refreshSession', err);
          reject(err);
        } 
        else {
          if (newSession && newSession.isValid()) {
            console.log('SESSION REFRESHED SUCCESSFULLY');
            this.setConfigCredentials(newSession.getIdToken().getJwtToken());
            resolve();
          }
        }
      });
    });
  },
  
  async setConfigCredentials(idToken: string) {
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