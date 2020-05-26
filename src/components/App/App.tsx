import browserHistory from 'browserHistory';
import Icon from 'components/Icon/Icon';
import useMount from 'hooks/UseMount';
import React, { useState } from 'react';
import { Link, Router } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import routes from 'routes';
import ApiService from 'services/ApiService';
import AppService from 'services/AppService';
import AuthenticationService from 'services/AuthenticationService';
import MessageService from 'services/MessageService';
import * as serviceWorker from 'serviceWorker';
import './App.sass';

const App: React.FC = () => {

  const [loggedInUserName, setLoggedInUserName] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

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

  const closeMenu = () => {
    document.querySelector('.navbar-menu')?.classList.remove('is-active');
    document.querySelector('.navbar-burger')?.classList.remove('is-active');
  };

  const onLogInClick = () => {
    closeMenu();
  }

  const onLogOutClick = () => {
    AuthenticationService.signOut();
    closeMenu();
  }

  /* register service worker onUpdate() */
  useMount(() => {
    const onServiceWorkerUpdate = (registration: ServiceWorkerRegistration) => {
      AppService.setNewServiceWorker(registration.installing || registration.waiting);
      MessageService.notifyIsUpdateAvailableChanged(true);
    }
    serviceWorker.register({ onUpdate: onServiceWorkerUpdate });

    // return () => { serviceWorker.unregister() }
    AppService.checkForUpdate();
  });

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

  /* listen for 'is update available' notifications */
  useMount(() => {
    const subscription = MessageService.observeIsUpdateAvailableChanged().subscribe(message => {
      if (message) {
        setIsUpdateAvailable(message.isUpdateAvailable);
      }
    });
    return () => subscription.unsubscribe();
  });

  /* listen for 'user name changed' notifications */
  useMount(() => {
    const subscription = MessageService.observeUserNameChanged().subscribe(message => {
      if (message) {
        setLoggedInUserName(message.userName);
      }
    });
    return () => subscription.unsubscribe();
  });

  return (
    <div id='app'>
      <Router history={browserHistory}>
        <nav className='navbar is-dark' aria-label='main navigation'>
          <div className='navbar-brand'>
            {isUpdateAvailable 
              ? <div 
                  className='badge update-available' 
                  title='Update available' 
                  onClick={() => {browserHistory.push('/about-roster')}}>
                </div>
              : null}
            <Link className='navbar-item' to='/' onClick={closeMenu}>
              <span className='icon' title='Home'>
                <Icon icon='home' fill='white' />
              </span>
              &nbsp;ROSTER&nbsp;
              <span className={`icon ${isOnline ? '': 'red-circle-white-x'}`} title={isOnline ? 'Online' : 'Offline'}>
                <Icon icon='wifi' fill='white' />
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
              <Link className='navbar-item' to='/about-roster' onClick={closeMenu}>About ROSTER</Link>
            </div>
            <div className='navbar-end'>
              <Link className={`navbar-item ${loggedInUserName ? 'hidden' : ''}`} to='/login' onClick={onLogInClick}>Log In</Link>
              <Link className={`navbar-item ${loggedInUserName ? '' : 'hidden'}`} to='/login' onClick={onLogOutClick}>Log Out ({loggedInUserName})</Link>
            </div>
          </div>
        </nav>
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
    </div>
  );
}

export default App;
