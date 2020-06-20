import { Box, Button, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import browserHistory from 'browserHistory';
import clsx from 'clsx';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import TextFormField from 'components/FormFields/TextFormField';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import SignInModel from 'models/SignInModel';
import React, { useRef, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import AuthenticationService from 'services/AuthenticationService';
import LogEntryService from 'services/LogEntryService';
import MessageService from 'services/MessageService';
import ToastService from 'services/ToastService';
import sharedStyles from 'styles/sharedStyles';

interface SignInProps {
  redirectPathOnAuthentication?: string;
}

const SignIn: React.FC<SignInProps> = ({ redirectPathOnAuthentication }) => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(sharedStyles(theme))
  );
  const classes = useStyles();

  const methods = useForm<SignInModel>({ mode: 'onChange', defaultValues: new SignInModel() });
  const { handleSubmit, reset } = methods;
  const [currentLogin, setCurrentLogin] = useState(new SignInModel());
  const [showSpinner, setShowSpinner] = useState(false);
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

  const onSubmit = handleSubmit(async (modifiedLogin: SignInModel) => {
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
      LogEntryService.saveLogEntry(`SIGN IN: ${userName}`);
    } else {
      MessageService.notifyUserNameChanged('');
      ToastService.error('Invalid sign-in');

      // CANNOT WRITE TO DB BEFORE AUTHENTICATING  :-/
      // LogEntryService.saveLogEntry(`Invalid login: ${modifiedLogin.userName}`);
    }
  });

  return (
    <Box id='login'>
      <Spinner isActive={showSpinner} />
      <Grid container justify='center'>
        <Grid item md={3}>
          <Typography variant='h1' align='center' gutterBottom={true}>Sign In</Typography>
          <FormContext {...methods}>
            <form onSubmit={onSubmit}>

              <FormFieldRow>
                <TextFormField fieldName='userName' labelText='User Name' validationOptions={{ required: 'User Name is required' }} refObject={userNameControlRef} />
              </FormFieldRow>
              <FormFieldRow>
                <TextFormField fieldName='password' labelText='Password' type='password' validationOptions={{ required: 'Password is required' }} refObject={passwordControlRef} />
              </FormFieldRow>

              <Box className={classes.formActionButtonsContainer}>
                <Button className={clsx(classes.fixedWidthMedium, classes.saveButton)} variant='contained' type='submit'>
                  Sign In
                </Button>
              </Box>

            </form>
          </FormContext>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignIn;
