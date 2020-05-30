import { Button, Grid, Typography } from '@material-ui/core';
import browserHistory from 'browserHistory';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import TextFormFieldMui from 'components/FormFields/TextFormFieldMui';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import LoginModel from 'models/LoginModel';
import React, { useRef, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import AuthenticationService from 'services/AuthenticationService';
import MessageService from 'services/MessageService';
import ToastService from 'services/ToastService';

interface LoginMuiProps {
  redirectPathOnAuthentication?: string;
}

const LoginMui: React.FC<LoginMuiProps> = ({ redirectPathOnAuthentication }) => {
  const [currentLogin, setCurrentLogin] = useState({} as LoginModel);
  const [showSpinner, setShowSpinner] = useState(false);
  const methods = useForm<LoginModel>({ mode: 'onChange' });
  const { handleSubmit, reset } = methods;
  const userNameControlRef = useRef<HTMLInputElement>()
  const passwordControlRef = useRef<HTMLInputElement>()

  useMount(() => {
    window.scrollTo(0, 0);
  });

  useMount(() => {
    const lastUserName = localStorage.getItem('lastUserName') || '';
    const initialLogin = { userName: lastUserName, password: '' };
    setCurrentLogin(initialLogin);
    reset(initialLogin);

    if (lastUserName) {
      passwordControlRef?.current?.focus();
    } else {
      userNameControlRef?.current?.focus();
    }
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
      MessageService.notifyUserNameChanged(userName);
      browserHistory.push(getPath());
    } else {
      MessageService.notifyUserNameChanged('');
      ToastService.error('Invalid login');
    }
  });

  return (
    <div id='login'>
      <Spinner isActive={showSpinner} />
      <Grid container justify='center'>
        <Grid item md={3}>
          <Typography variant='h1' align='center' gutterBottom={true}>Log In</Typography>
          <FormContext {...methods}>
            <form onSubmit={onSubmit}>

              <FormFieldRow>
                <TextFormFieldMui fieldName='userName' labelText='User Name' validationOptions={{ required: 'User Name is required' }} refObject={userNameControlRef} />
              </FormFieldRow>
              <FormFieldRow>
                <TextFormFieldMui fieldName='password' labelText='Password' type='password' validationOptions={{ required: 'Password is required' }} refObject={passwordControlRef} />
              </FormFieldRow>

              <div className='form-action-buttons-container'>
                <Button className='is-fixed-width-medium save-button' variant='contained' type='submit'>
                  Log In
                </Button>
              </div>

            </form>
          </FormContext>
        </Grid>
      </Grid>
    </div>
  );
};

export default LoginMui;
