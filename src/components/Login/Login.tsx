import React from 'react';
import browserHistory from '../../browserHistory';
import { useAppContext } from '../../contexts/AppContext';
import AuthenticationService from '../../services/AuthenticationService';
import './Login.sass';

const Login: React.FC = () => {
  const [appContext, setAppContext] = useAppContext();

  const logIn = () => {
    AuthenticationService.authenticate(() => {
      setAppContext({...appContext, isAuthenticated: true, redirectPathOnAuthentication: ''});
      browserHistory.push(getPath());
    })
  }

  const getPath = ():string  => {
    if (!appContext.redirectPathOnAuthentication || appContext.redirectPathOnAuthentication === '/login') {
      return '/';
    } else {
      return appContext.redirectPathOnAuthentication;
    }
  }

  return (
    <div id='login'>
      <div className='columns'>
        <div className='column has-text-centered'>
          <h1 className='title has-text-centered'>Log In</h1>
          <button className='button is-success' onClick={logIn}>Log In</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
