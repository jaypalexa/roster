import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserSession, IAuthenticationDetailsData, ICognitoUserData, ICognitoUserPoolData } from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';
import browserHistory from 'browserHistory';
import jwt_decode from 'jwt-decode';
import LoginModel from 'models/LoginModel';

const CLIENT_ID = process.env.REACT_APP_AWS_COGNITO_CLIENT_ID || '';
const IDENTITY_POOL_ID = process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID || '';
const USER_POOL_ID = process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID || '';
const REGION = process.env.REACT_APP_AWS_REGION || '';
const ISSUER = `cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;

const USER_POOL_DATA: ICognitoUserPoolData = {
  UserPoolId: USER_POOL_ID,
  ClientId: CLIENT_ID
};

const USER_POOL = new CognitoUserPool(USER_POOL_DATA);

let lastUserActivity = Date.now();
let sessionStatusPollingTimeout: NodeJS.Timeout;


export const AuthenticationService = {
  
  resetSessionStatusPolling() {
    console.log(`In resetSessionStatusPolling() at ${(new Date().toUTCString())} -- lastActivity = ${(new Date(lastUserActivity).toUTCString())}`);

    clearTimeout(sessionStatusPollingTimeout);

    const POLLING_INTERVAL = 5 * 60 * 1000; // 5 min
    if (!this.isUserAuthenticated()) return;
    sessionStatusPollingTimeout = setTimeout(async () => {
      if (!this.isUserAuthenticated()) return;
      await this.checkSessionStatusAsync();
      this.resetSessionStatusPolling();         
    }, POLLING_INTERVAL);
  },

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
      const cognitoUser = new CognitoUser(cognitoUserData);
    
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

      this.updateUserActivity();
      this.resetSessionStatusPolling();

      return true;
    }
    catch(err) {
      console.log('ERROR in UseAuthentication::authenticateUserAsync()', err);
      this.signOut();
      return false;
    }
  },

  clearCachedCredentials() {
    const currentCredentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: IDENTITY_POOL_ID});
    currentCredentials.clearCachedId();
  },

  fetchCurrentCognitoUser(): CognitoUser | null {
    return USER_POOL.getCurrentUser();
  },

  fetchCurrentSessionPromise(cognitoUser: CognitoUser) {
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
  },
  
  getAccessToken(): string {
    const lastAuthUser = this.getLastAuthUser();
    return localStorage.getItem(`CognitoIdentityServiceProvider.${CLIENT_ID}.${lastAuthUser}.accessToken`) || '';
  },
  
  getCognitoUserNameFromToken(): string {
    if (!this.isUserAuthenticated()) return '';

    const idToken = this.getIdToken();
    if (!idToken) return '';

    const decodedIdToken: any = jwt_decode(idToken);
    if (!decodedIdToken) return '';

    return decodedIdToken['cognito:username'] as string;
  },
      
  getIdToken(): string {
    const lastAuthUser = this.getLastAuthUser();
    return localStorage.getItem(`CognitoIdentityServiceProvider.${CLIENT_ID}.${lastAuthUser}.idToken`) || '';
  },

  getLastAuthUser(): string {
    return localStorage.getItem(`CognitoIdentityServiceProvider.${CLIENT_ID}.LastAuthUser`) || '';
  },
  
  getOrganizationId(): string {
    const idToken = this.getIdToken();
    if (!idToken) return '';

    const decodedIdToken: any = jwt_decode(idToken);
    if (!decodedIdToken) return '';

    return decodedIdToken['custom:organizationId'] as string;
  },

  getSessionExpirationDate(cognitoUserSession: CognitoUserSession): string {
    const jwt = cognitoUserSession.getIdToken().getJwtToken();
    const decodedIdToken: any = jwt_decode(jwt);
    const exp = decodedIdToken['exp'] as number;
    return (new Date(exp * 1000)).toUTCString();
  },

  isCurrentSessionValid(): boolean {
    const idToken = this.getIdToken();
    if (!idToken) return false;

    const decodedIdToken: any = jwt_decode(idToken);
    if (!decodedIdToken) return false;

    const accessToken = this.getAccessToken();
    if (!accessToken) return false;

    const decodedAccessToken: any = jwt_decode(accessToken);
    if (!decodedAccessToken) return false;

    if (decodedIdToken.aud !== CLIENT_ID) {
      console.log('THE ID TOKEN AUDIENCE IS INVALID');
      return false;
    }

    if (!decodedIdToken.iss.endsWith(ISSUER) || !decodedAccessToken.iss.endsWith(ISSUER)) {
      console.log('THE ID TOKEN AND/OR THE ACCESS TOKEN CLAIM ISSUER IS INVALID');
      return false;
    }

    const now = (Date.now() / 1000); // seconds
    
    const isFutureAuthTime = ((now < decodedIdToken.auth_time - 300) || (now < decodedAccessToken.auth_time - 300));
    if (isFutureAuthTime) {
      console.log('THE ID TOKEN AND/OR THE ACCESS TOKEN HAVE AUTH TIMES IN THE FUTURE');
      return false;
    }
    
    const hasExpired = ((decodedIdToken.exp < now) || (decodedAccessToken.exp < now));
    if (hasExpired) {
      console.log('THE ID TOKEN AND/OR THE ACCESS TOKEN HAVE EXPIRED');
      return false;
    }

    return true;
  },

  isUserAuthenticated(): boolean {
    if (this.isCurrentSessionValid()) {
      this.setConfigCredentials(this.getIdToken());
      return true;
    } else {
      this.signOut();
      return false;
    }
  },
  
  isWithinSessionRefreshWindow(): boolean {
    const idToken = this.getIdToken();
    if (!idToken) return true;

    const decodedIdToken: any = jwt_decode(idToken);
    if (!decodedIdToken) return true;

    const SESSION_REFRESH_THRESHOLD = 15 * 60; // 15 MINUTES

    const now = (Date.now() / 1000); // seconds
    const exp = decodedIdToken?.exp as number; // seconds

    // if ID token is within expiry threshold
    const diff = Math.floor(exp - now); // seconds
    console.log('isWithinRefreshWindow()::diff', diff);
    const isLessThanThreshold = (diff <= SESSION_REFRESH_THRESHOLD); // seconds
    console.log(`isWithinRefreshWindow()::isLessThanThreshold (${diff} <= ${SESSION_REFRESH_THRESHOLD})`, isLessThanThreshold);
    return isLessThanThreshold;
  },

  updateUserActivity() {
    lastUserActivity = Date.now();
    console.log(`updateUserActivity -- lastActivity = ${(new Date(lastUserActivity).toUTCString())}`);
  },

  userActivityHasTimedOut(): boolean {
    // const SESSION_ACTIVITY_THRESHOLD = 15 * 1000; // 15 SECONDS
    const SESSION_ACTIVITY_THRESHOLD = 30 * 60 * 1000; // 30 MINUTES
    const now = Date.now(); // milliseconds

    // if user has been inactive for longer than threshold
    const diff = Math.floor(now - lastUserActivity); // milliseconds
    console.log('userActivityHasTimedOut()::diff', diff);
    const isGreaterThanThreshold = (diff > SESSION_ACTIVITY_THRESHOLD);
    console.log(`userActivityHasTimedOut()::isGreaterThanThreshold (${diff} > ${SESSION_ACTIVITY_THRESHOLD})`, isGreaterThanThreshold);
    return isGreaterThanThreshold;
  },

  async checkSessionStatusAsync(): Promise<void> {
    console.log(`In checkSessionActivityAsync() at ${(new Date().toUTCString())} -- lastActivity = ${(new Date(lastUserActivity).toUTCString())}`);

    if (!this.isUserAuthenticated()) return;

    if (this.userActivityHasTimedOut()) {
      this.signOut();
      browserHistory.push('/login');
    } else {
      if (this.isWithinSessionRefreshWindow()) {
        await this.refreshSessionAsync();
      }
    }
  },

  async refreshSessionAsync(): Promise<void> {
    console.log(`In refreshSessionAsync() at ${(new Date().toUTCString())}...`);

    const currentCognitoUser = this.fetchCurrentCognitoUser();
    console.log(`refreshSessionAsync()::currentCognitoUser`, currentCognitoUser);
    if (currentCognitoUser) {
      const currentSession = await this.fetchCurrentSessionPromise(currentCognitoUser);
      console.log(`refreshSessionAsync()::currentSession`, currentSession);
      console.log(`refreshSessionAsync()::currentSession?.isValid()`, currentSession?.isValid());
      if (currentSession?.isValid()) {
        console.log(`refreshSessionAsync()::CURRENT SESSION EXPIRES at ${this.getSessionExpirationDate(currentSession)}`);
        const refreshToken = currentSession.getRefreshToken();
        currentCognitoUser.refreshSession(refreshToken, (err: any, newSession: CognitoUserSession) => {
          if (err) {
            console.log('ERROR in AuthenticationService::refreshSessionAsync()::currentCognitoUser.refreshSession()', err);
          } 
          else {
            console.log(`refreshSessionAsync()::newSession`, newSession);
            console.log(`refreshSessionAsync()::newSession?.isValid()`, newSession?.isValid());
            if (newSession?.isValid()) {
              console.log(`refreshSessionAsync()::NEW SESSION EXPIRES at ${this.getSessionExpirationDate(newSession)}`);
              console.log('SESSION REFRESHED SUCCESSFULLY');
              this.setConfigCredentials(newSession.getIdToken().getJwtToken());
            }
          }
        });
      }
    }
  },
  
  setConfigCredentials(idToken: string) {
    this.clearCachedCredentials();
    
    AWS.config.region = REGION;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: IDENTITY_POOL_ID,
      Logins: {
        [ISSUER]: idToken
      }
    });
  },  

  signOut() {
    console.log(`In signOut() at ${(new Date().toUTCString())}`);
    console.log('signOut()::sessionStatusPollingTimeout', sessionStatusPollingTimeout);
    clearTimeout(sessionStatusPollingTimeout);
    this.clearCachedCredentials();
    const currentCognitoUser = this.fetchCurrentCognitoUser();
    console.log('AuthenticationService::signOut::currentCognitoUser', currentCognitoUser);
    if (currentCognitoUser) {
      currentCognitoUser.signOut();
    }
  },
}

export default AuthenticationService;