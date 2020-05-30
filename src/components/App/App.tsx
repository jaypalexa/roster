import browserHistory from 'browserHistory';
import NavBar from 'components/NavBar/NavBar';
import Toast, { ToastProps } from 'components/Toast/Toast';
import useMount from 'hooks/UseMount';
import React, { useState } from 'react';
import { Router } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import routes from 'routes';
import ApiService from 'services/ApiService';
import AppService from 'services/AppService';
import AuthenticationService from 'services/AuthenticationService';
import MessageService from 'services/MessageService';
import * as serviceWorker from 'serviceWorker';
import { isIosDevice } from 'utils';
import './App.sass';

const App: React.FC = () => {

  const [toastProps, setToastProps] = useState<ToastProps>({} as ToastProps);

  /* register service worker onUpdate() */
  useMount(() => {
    const onServiceWorkerUpdate = (registration: ServiceWorkerRegistration) => {
      AppService.setNewServiceWorker(registration.installing || registration.waiting);
      MessageService.notifyIsUpdateAvailableChanged(true);
    }
    serviceWorker.register({ onUpdate: onServiceWorkerUpdate });

    if (!isIosDevice) {
      AppService.checkForUpdate();
    }
  });

  /* wake up lambda */
  useMount(() => {
    const tryWakeup = async () => {
      try {
        await ApiService.wakeup();
      }
      catch(err) {
        console.log(err);
      }
    }
    tryWakeup();
  });

  /* start the session activity polling */
  useMount(() => {
    const startSessionActivityPolling = async () => {
      await AuthenticationService.checkSessionStatusAsync();
      AuthenticationService.resetSessionStatusPolling();
    }
    startSessionActivityPolling();
  });

  /* listen for toast messages */
  useMount(() => {
    const subscription = MessageService.observeToastRequest().subscribe(toastProps => {
      if (toastProps) {
        setToastProps(toastProps);
      }
    });
    return () => subscription.unsubscribe();
  });

  return (
    <div id='app'>
      <Router history={browserHistory}>
        <NavBar />
        <div className='content-container'>
          {/* child components are rendered here */}
          {routes()}
        </div>
      </Router>
      <ToastContainer
        autoClose={1200}
        position='bottom-center'
        transition={Slide}
        pauseOnHover={true}
        className='toast-container'
        toastClassName='toast-custom'
      />
      <Toast {...toastProps}></Toast>
    </div>
  );
}

export default App;
