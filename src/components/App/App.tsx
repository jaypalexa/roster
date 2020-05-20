import browserHistory from 'browserHistory';
import useMount from 'hooks/UseMount';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, Router } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import routes from 'routes';
import ApiService from 'services/ApiService';
import AuthenticationService from 'services/AuthenticationService';
import * as serviceWorker from 'serviceWorker';
import './App.sass';

const App: React.FC = () => {
  // console.log(`[${Date.now().toString()}] *** APP at ${(new Date().toUTCString())} ***`);

  const [lastUpdateCheckDateTime, setLastUpdateCheckDateTime] = useState<string | null>(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isShowUpdateAvailable, setIsShowUpdateAvailable] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [loggedInUserName, setLoggedInUserName] = useState('');
  const [newServiceWorker, setNewServiceWorker] = useState<ServiceWorker | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  const onlineOfflineHandler = (event: Event) => {
    setIsOnline(navigator.onLine);

    if (event.type === 'online') {
      //TODO:  do something when browser goes back online
      //alert('ONLINE');
    } else {
      //TODO:  do something when browser goes offline
      //alert('OFFLINE');
    }
  }

  const onUpdateAvailableClick = () => {
    console.log('onUpdateAvailableClick::newServiceWorker = ', newServiceWorker);
    if (newServiceWorker) {
      newServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      if ('serviceWorker' in navigator) {
        console.log('onUpdateAvailableClick::\'serviceWorker\' in navigator...');
        navigator.serviceWorker.ready.then(registration => {
          console.log('onUpdateAvailableClick::registration.update().then()::registration = ', registration);
          const serviceWorker = (registration.installing || registration.waiting);
          console.log('onUpdateAvailableClick::registration.update().then()::serviceWorker = ', serviceWorker);
          if (serviceWorker) {
            serviceWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        })
      } else {
        console.log('onUpdateAvailableClick::\'serviceWorker\' NOT in navigator...');
      }
    }
    setIsUpdateAvailable(false);
    window.location.reload(true);
  };

  const onCheckForUpdateClick = () => {
    setLastUpdateCheckDateTime(moment().format('YYYY-MM-DD HH:mm:ss'));

    const isIosDevice = /iphone|ipod|ipad/i.test(navigator.userAgent);
    // const isChromeOnIosDevice = /CriOS/i.test(navigator.userAgent) && isIosDevice;

    if (isIosDevice) {
      alert(`You must close and re-open the app or browser tab to check for updates when running on an iOS device.\n\n:-(`);
    } else {
      checkForUpdate();
    }
  }

  const checkForUpdate = useCallback(() => {
    setLastUpdateCheckDateTime(moment().format('YYYY-MM-DD HH:mm:ss'));
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        console.log('checkForUpdate::navigator.serviceWorker.ready...');
        registration.update().then(() => {
          console.log('checkForUpdate::registration.update().then()::registration = ', registration);
          const serviceWorker = (registration.installing || registration.waiting);
          console.log('checkForUpdate::registration.update().then()::serviceWorker = ', serviceWorker);
          if (serviceWorker) {
            setNewServiceWorker(serviceWorker);
            setIsUpdateAvailable(true);
          }
        });
      })
    }
    else {
      console.log('checkForUpdate::\'serviceWorker\' NOT in navigator...');
    }
  }, []);

  const closeMenu = () => {
    document.querySelector('.navbar-menu')?.classList.remove('is-active');
    document.querySelector('.navbar-burger')?.classList.remove('is-active');
  };

  const onLogInClick = () => {
    closeMenu();
  }

  const onLogOutClick = () => {
    setLoggedInUserName('');
    AuthenticationService.signOut();
    closeMenu();
    setTriggerRefresh(!triggerRefresh);
  }

  /* fetch user name */
  useMount(() => {
    const userName = AuthenticationService.getCognitoUserNameFromToken();
    setLoggedInUserName(userName);
  });

  /* register navbar burger toggle handlers */
  useMount(() => {
    const navbarBurgerDiv = document.querySelector('.navbar-burger') as HTMLDivElement;
    const toggleOn = () => {
      const target = navbarBurgerDiv.dataset.target || '';
      const targetDiv = document.getElementById(target) as HTMLDivElement;
      targetDiv.classList.toggle('is-active');
    }
    navbarBurgerDiv.addEventListener('click', toggleOn);

    return () => {
      navbarBurgerDiv.removeEventListener('click', toggleOn);
    }
  });

  /* register service worker onUpdate() */
  useMount(() => {
    const onServiceWorkerUpdate = (registration: ServiceWorkerRegistration) => {
      setNewServiceWorker(registration.installing || registration.waiting);
      setIsUpdateAvailable(true);
    }
    serviceWorker.register({ onUpdate: onServiceWorkerUpdate });

    return () => { serviceWorker.unregister() }
  });

  /* check for update */
  useMount(() => {
    checkForUpdate();
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

  /* add online/offline event handlers */
  useMount(() => {
    window.addEventListener('online', onlineOfflineHandler);
    window.addEventListener('offline', onlineOfflineHandler);
    return () => {
      window.removeEventListener('online', onlineOfflineHandler);
      window.removeEventListener('offline', onlineOfflineHandler);
    }
  });

  /* start the session activity polling */
  useMount(() => {
    const startSessionActivityPolling = async () => {
      await AuthenticationService.checkSessionStatusAsync();
      AuthenticationService.resetSessionStatusPolling();
    }
    startSessionActivityPolling();
  });

  useEffect(() => {
    setIsShowUpdateAvailable(isUpdateAvailable);
  }, [isUpdateAvailable]);

  return (
    <div id='app'>
      <Router history={browserHistory}>
        <nav className='navbar is-dark' aria-label='main navigation'>
          <div className='navbar-brand'>
            <Link className='navbar-item' to='/' onClick={closeMenu}>
              <span className='icon'>
                <i className='fa fa-home'></i>
              </span>
              &nbsp;ROSTER&nbsp;
              <span className='fa-stack'>
                <i className='fa fa-wifi fa-stack-1x' title='Online'></i>
                {!isOnline ? <i className='fa fa-ban fa-stack-2x red' title='Offline'></i> : null}
              </span>
            </Link>
            <div role='button' className='navbar-burger burger' aria-label='menu' aria-expanded='false' data-target='navMenu'>
              <span aria-hidden='true'></span>
              <span aria-hidden='true'></span>
              <span aria-hidden='true'></span>
            </div>
          </div>

          <div id='navMenu' className='navbar-menu'>
            <div className='navbar-start'>
              <Link className='navbar-item' to='/sea-turtles' onClick={closeMenu}>Sea Turtles</Link>
              <Link className='navbar-item' to='/holding-tanks' onClick={closeMenu}>Holding Tanks</Link>
              <Link className='navbar-item' to='/hatchlings-events' onClick={closeMenu}>Hatchlings Events</Link>
              <Link className='navbar-item' to='/washbacks-events' onClick={closeMenu}>Washbacks Events</Link>
              <Link className='navbar-item' to='/reports' onClick={closeMenu}>Reports</Link>
              <Link className='navbar-item' to='/blank-forms' onClick={closeMenu}>Blank Forms</Link>
              <Link className='navbar-item' to='/organization' onClick={closeMenu}>Organization</Link>
            </div>
            <div className='navbar-end'>
              <Link className={`navbar-item ${loggedInUserName ? 'hidden' : ''}`} to='/login' onClick={onLogInClick}>Log In</Link>
              <Link className={`navbar-item ${loggedInUserName ? '' : 'hidden'}`} to='/login' onClick={onLogOutClick}>Log Out ({loggedInUserName})</Link>
            </div>
          </div>
        </nav>
        <div className='content-container'>
          {routes(setLoggedInUserName)}
          <div className='bottom-panel has-text-centered'>
            Copyright &copy; 2006-2020 <a href='http://www.turtlegeek.com' target='_blank' rel='noopener noreferrer' title='TurtleGeek.com'>TurtleGeek.com</a>
            &nbsp;|&nbsp;
            <a href='https://github.com/jaypalexa/roster' target='_blank' rel='noopener noreferrer' title='GitHub'>
              GitHub
            </a>
            &nbsp;|&nbsp;v0.20200520.1515
            {isShowUpdateAvailable ? <p><span>(</span><span className='span-link show-underline' onClick={onUpdateAvailableClick}>update available</span><span>)</span></p> : null}
            {!isShowUpdateAvailable ? <p><span>(</span><span className='span-link show-underline' onClick={onCheckForUpdateClick}>check for update</span>{lastUpdateCheckDateTime ? <span> - last checked: {lastUpdateCheckDateTime}</span> : null}<span>)</span></p> : null}
          </div>
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
    </div>
  );
}

export default App;
