import browserHistory from 'browserHistory';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import TextFormField from 'components/FormFields/TextFormField';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import LoginModel from 'models/LoginModel';
import React, { useRef, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import AuthenticationService from 'services/AuthenticationService';
import './Login.sass';

interface LoginProps {
  setLoggedInUserName: React.Dispatch<React.SetStateAction<string>>;
  redirectPathOnAuthentication?: string;
}

const Login: React.FC<LoginProps> = ({ setLoggedInUserName, redirectPathOnAuthentication }) => {
  const [currentLogin, setCurrentLogin] = useState({} as LoginModel);
  const [showSpinner, setShowSpinner] = useState(false);
  const methods = useForm<LoginModel>({ mode: 'onChange' });
  const { handleSubmit, reset } = methods;
  const firstEditControlRef = useRef<HTMLInputElement>()

  useMount(() => {
    window.scrollTo(0, 0);
  });

  useMount(() => {
    const lastUserName = localStorage.getItem('lastUserName') || '';
    const initialLogin = { userName: lastUserName, password: '' };
    setCurrentLogin(initialLogin);
    reset(initialLogin);
  });

  useMount(() => {
    firstEditControlRef?.current?.focus();
  });

  const getPath = (): string => {
    if (!redirectPathOnAuthentication || redirectPathOnAuthentication === '/login') {
      return '/';
    } else {
      return redirectPathOnAuthentication;
    }
  };

  const onSubmit = handleSubmit(async (modifiedLogin: LoginModel) => {
    setShowSpinner(true);
    const patchedLogin = { ...currentLogin, ...modifiedLogin };
    reset(patchedLogin);
    setCurrentLogin(patchedLogin);

    localStorage.setItem('lastUserName', modifiedLogin.userName);

    const isAuthenticated = await AuthenticationService.authenticateUserAsync(modifiedLogin);
    setShowSpinner(false);
    
    if (isAuthenticated) {
      const userName = AuthenticationService.getCognitoUserNameFromToken(); 
      setLoggedInUserName(userName);
      browserHistory.push(getPath());
    } else {
      setLoggedInUserName('');
      toast.error('Invalid login');
    }
  });

  return (
    <div id='login'>
      <Spinner isActive={showSpinner} />
      <div className='columns is-centered'>
        <div className='column is-two-fifths'>
          <h1 className='title has-text-centered'>Log In</h1>
          <FormContext {...methods}>
            <form onSubmit={onSubmit}>

              <FormFieldRow>
                <TextFormField fieldName='userName' labelText='User Name' validationOptions={{ required: 'User Name is required' }} refObject={firstEditControlRef} />
              </FormFieldRow>
              <FormFieldRow>
                <TextFormField fieldName='password' labelText='Password' type='password' validationOptions={{ required: 'Password is required' }} />
              </FormFieldRow>

              <div className='field is-grouped form-action-buttons'>
                <p className='control'>
                  <input
                    type='submit'
                    className='button is-success is-fixed-width-medium'
                    value='Log In'
                  />
                </p>
              </div>

            </form>
          </FormContext>
        </div>
      </div>
    </div>
  );
};

export default Login;
