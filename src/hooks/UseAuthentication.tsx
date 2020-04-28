import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import { useAppContext } from 'contexts/AppContext';
import jwt_decode from 'jwt-decode';
import LoginModel from 'types/LoginModel';

const useAuthentication = () => {

  const [appContext, setAppContext] = useAppContext();

  const POOL_DATA = {
    UserPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID || '',
    ClientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID || ''
  };
  
  const cognitoUserPool = new CognitoUserPool(POOL_DATA);

  const doAuthenticateUser = (login: LoginModel) => {
    const authenticationDetailsData = {
      Username: login.userName,
      Password: login.password
    };
    const authenticationDetails = new AuthenticationDetails(authenticationDetailsData);
    const cognitoUser = getCognitoUser(login.userName);

    return new Promise<CognitoUserSession | any>((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: resolve,
        onFailure: reject,
        newPasswordRequired: resolve
      });
    });
  }

  const authenticateUser = async (login: LoginModel): Promise<boolean> => {
    try {
      var result = await doAuthenticateUser(login);
      console.log('UseAuthentication::authenticateUser()::result', result);
      setAppContext({ ...appContext, 
        loggedInUserName: login.userName, 
        organizationId: result.idToken.payload['custom:organizationId'] 
      });
      return true;
    }
    catch(err) {
      console.log('ERROR in UseAuthentication::authenticateUser()', err);
      setAppContext({});
      return false;
    }
  }

  const getCognitoUser = (userName: string): CognitoUser => {
    const cognitoUserData = { Username: userName, Pool: cognitoUserPool };
    return new CognitoUser(cognitoUserData);
  }

  const getJwtToken = (): string => {
    const lastAuthUser = getLastAuthUser();
    return localStorage.getItem(`CognitoIdentityServiceProvider.${process.env.REACT_APP_AWS_COGNITO_CLIENT_ID}.${lastAuthUser}.idToken`) || '';
  }

  const getLastAuthUser = (): string => {
    return localStorage.getItem(`CognitoIdentityServiceProvider.${process.env.REACT_APP_AWS_COGNITO_CLIENT_ID}.LastAuthUser`) || '';
  }

  const getTokenOrganizationId = (): string => {
    const token = getJwtToken();
    if (!token) return '';
    const decodedToken: any = jwt_decode(token);
    if (!decodedToken) return '';

    return decodedToken['custom:organizationId'];
  }

  const getTokenUserName = (): string => {
    const token = getJwtToken();
    if (!token) return '';
    const decodedToken: any = jwt_decode(token);
    if (!decodedToken) return '';
    
    return decodedToken['cognito:username'];
  }

  const isUserAuthenticated = (): boolean => {
    const token = getJwtToken();
    if (!token) return false;
    const decodedToken: any = jwt_decode(token);
    if (!decodedToken) return false;

    console.log('decodedToken', decodedToken);

    const userName = decodedToken['cognito:username'];

    if ((decodedToken.exp >= Date.now() / 1000) && (userName === getLastAuthUser())) {
      return true;
    } else {
      signOut();
      return false;
    }
  }

  const signOut = () => {
    const lastAuthUser = getLastAuthUser();
    if (!lastAuthUser) return;
  
    const cognitoUser = getCognitoUser(lastAuthUser);
    cognitoUser.signOut();
  }

  return { authenticateUser, getJwtToken, getTokenOrganizationId, getTokenUserName, isUserAuthenticated, signOut };
}

export default useAuthentication;