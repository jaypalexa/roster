import { Box, Container, createStyles, makeStyles, Theme } from '@material-ui/core';
import browserHistory from 'browserHistory';
import NavBar from 'components/NavBar';
import Toast, { ToastProps } from 'components/Toast';
import React, { useEffect, useState } from 'react';
import { Router } from 'react-router-dom';
import routes from 'routes';
import AuthenticationService from 'services/AuthenticationService';
import MessageService from 'services/MessageService';
import sharedStyles from 'styles/sharedStyles';

const App: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(
      {
        ...sharedStyles(theme),
        root: {
          height: '100%',
          width: '100%',
          maxWidth: 'none',
          margin: 'auto',
          padding: 0,
        },
        contentContainer: {
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          marginTop: '1.5rem',
          marginRight: '1rem',
          marginLeft: '1rem',
        },
      })
  );
  const classes = useStyles();

  const [toastProps, setToastProps] = useState<ToastProps>({} as ToastProps);

  /* start the session activity polling */
  useEffect(() => {
    const startSessionActivityPolling = async () => {
      await AuthenticationService.checkSessionStatusAsync();
      AuthenticationService.resetSessionStatusPolling();
    }
    startSessionActivityPolling();
  }, []);

  /* listen for toast messages */
  useEffect(() => {
    const subscription = MessageService.observeToastRequest().subscribe(toastProps => {
      if (toastProps) {
        setToastProps(toastProps);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Container id='app' className={classes.root}>
      <Router history={browserHistory}>
        <NavBar />
        <Box className={classes.contentContainer}>
          {/* child components are rendered here */}
          {routes()}
        </Box>
      </Router>
      <Toast {...toastProps}></Toast>
    </Container>
  );
}

export default App;
