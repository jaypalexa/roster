import { Box, Button, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import browserHistory from 'browserHistory';
import clsx from 'clsx';
import FormFieldRowMui from 'components/FormFields/FormFieldRowMui';
import TextFormFieldMui from 'components/FormFields/TextFormFieldMui';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import LoginModel from 'models/LoginModel';
import React, { useRef, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import AuthenticationService from 'services/AuthenticationService';
import MessageService from 'services/MessageService';
import ToastService from 'services/ToastService';
import sharedStyles from 'styles/sharedStyles';

interface LoginMuiProps {
  redirectPathOnAuthentication?: string;
}

const LoginMui: React.FC<LoginMuiProps> = ({ redirectPathOnAuthentication }) => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(sharedStyles(theme))
  );
  const classes = useStyles();

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

              <FormFieldRowMui>
                <TextFormFieldMui fieldName='userName' labelText='User Name' validationOptions={{ required: 'User Name is required' }} refObject={userNameControlRef} />
              </FormFieldRowMui>
              <FormFieldRowMui>
                <TextFormFieldMui fieldName='password' labelText='Password' type='password' validationOptions={{ required: 'Password is required' }} refObject={passwordControlRef} />
              </FormFieldRowMui>

              <Box className={classes.formActionButtonsContainer}>
                <Button className={clsx(classes.fixedWidthMedium, classes.saveButton)} variant='contained' type='submit'>
                  Log In
                </Button>
              </Box>

            </form>
          </FormContext>
        </Grid>
      </Grid>
    </div>
  );
};

export default LoginMui;
