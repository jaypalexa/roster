import HatchlingEvents from 'components/HatchlingsEvents/HatchlingsEvents';
import HoldingTankGraphs from 'components/HoldingTankGraphs/HoldingTankGraphs';
import HoldingTankMeasurements from 'components/HoldingTankMeasurements/HoldingTankMeasurements';
import HoldingTanks from 'components/HoldingTanks/HoldingTanks';
import Home from 'components/Home/Home';
import Login from 'components/Login/Login';
import NotFound from 'components/NotFound/NotFound';
import Organization from 'components/Organization/Organization';
import ProtectedRoute, { ProtectedRouteProps } from 'components/ProtectedRoute/ProtectedRoute';
import Reports from 'components/Reports/Reports';
import SeaTurtleMorphometrics from 'components/SeaTurtleMorphometrics/SeaTurtleMorphometrics';
import SeaTurtleMorphometricsGraphs from 'components/SeaTurtleMorphometricsGraphs/SeaTurtleMorphometricsGraphs';
import SeaTurtles from 'components/SeaTurtles/SeaTurtles';
import SeaTurtleTags from 'components/SeaTurtleTags/SeaTurtleTags';
import WashbackEvents from 'components/WashbacksEvents/WashbacksEvents';
import useMount from 'hooks/UseMount';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, Route, Router, Switch } from 'react-router-dom';
import { Slide, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import browserHistory from '../../browserHistory';
import { useAppContext } from '../../contexts/AppContext';
import AuthenticationService from '../../services/AuthenticationService';
import * as serviceWorker from '../../serviceWorker';
import './App.sass';

// import logo from './logo.svg';

const App: React.FC = () => {

  const [appContext, setAppContext] = useAppContext();
  const [lastUpdateCheckDateTime, setLastUpdateCheckDateTime] = useState<string | null>(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isShowUpdateAvailable, setIsShowUpdateAvailable] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [newServiceWorker, setNewServiceWorker] = useState<ServiceWorker | null>(null);

  const onReloadPageClick = () => {
    console.log('onReloadPageClick::newServiceWorker = ', newServiceWorker);
    if (newServiceWorker) {
      newServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      if ('serviceWorker' in navigator) {
        console.log('onReloadPageClick::\'serviceWorker\' in navigator...');
        navigator.serviceWorker.ready.then(registration => {
          console.log('onReloadPageClick::navigator.serviceWorker.ready...');
          const serviceWorker = (registration.installing || registration.waiting);
          console.log('onReloadPageClick::serviceWorker = ', serviceWorker);
          if (serviceWorker) {
            serviceWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        })
      } else {
        console.log('onReloadPageClick::\'serviceWorker\' NOT in navigator...');
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
          const serviceWorker = (registration.installing || registration.waiting);
          console.log('checkForUpdate::registration.update::serviceWorker = ', serviceWorker);
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

  const setRedirectPathOnAuthentication = (path: string) => {
    setAppContext({ ...appContext, redirectPathOnAuthentication: path });
  }

  const defaultProtectedRouteProps: ProtectedRouteProps = {
    isAuthenticated: true, // !!AuthenticationService.isAuthenticated, // !!appContext.isAuthenticated, //TODO:  WIRE IN REAL AUTHENTICATION !!!
    redirectPathOnAuthentication: appContext.redirectPathOnAuthentication || '',
    setRedirectPathOnAuthentication
  };

  const logOut = () => {
    AuthenticationService.signout(() => {
      closeMenu();
      setTriggerRefresh(!triggerRefresh);
    })
  }
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

  useMount(() => {
    const onServiceWorkerUpdate = (registration: ServiceWorkerRegistration) => {
      setNewServiceWorker(registration.installing || registration.waiting);
      setIsUpdateAvailable(true);
    }
    serviceWorker.register({ onUpdate: onServiceWorkerUpdate });

    return () => { serviceWorker.unregister() }
  });

  useMount(() => {
    checkForUpdate();
  });

  useEffect(() => {
    setIsShowUpdateAvailable(isUpdateAvailable);
  }, [isUpdateAvailable]);

  return (
    //<img src={logo} className='App-logo' alt='logo' />
    <div id='app'>
      <Router history={browserHistory}>
        <nav className='navbar is-dark' aria-label='main navigation'>
          <div className='navbar-brand'>
            <Link className='navbar-item' to='/' onClick={closeMenu}>
              <span className='icon'>
                <i className='fa fa-home'></i>
              </span>
              &nbsp;ROSTER
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
              <Link className='navbar-item' to='/organization' onClick={closeMenu}>Organization</Link>
            </div>
            <div className='navbar-end'>
              <Link className={`navbar-item ${AuthenticationService.isAuthenticated ? 'hidden' : ''}`} to='/login' onClick={closeMenu}>Log In</Link>
              <span className={`navbar-item ${AuthenticationService.isAuthenticated ? '' : 'hidden'} is-hidden-mobile`} >{AuthenticationService.loggedInUserName}</span>
              <span className={`navbar-item ${AuthenticationService.isAuthenticated ? '' : 'hidden'} is-hidden-mobile`} >|</span>
              <Link className={`navbar-item ${AuthenticationService.isAuthenticated ? '' : 'hidden'}`} to='/login' onClick={logOut}>Log Out</Link>
            </div>
          </div>
        </nav>

        <div className='content-container'>
          <Switch>
            <ProtectedRoute {...defaultProtectedRouteProps} exact={true} path='/' component={Home} />
            <ProtectedRoute {...defaultProtectedRouteProps} path='/sea-turtles' component={SeaTurtles} />
            <ProtectedRoute {...defaultProtectedRouteProps} path='/sea-turtle-tags' component={SeaTurtleTags} />
            <ProtectedRoute {...defaultProtectedRouteProps} path='/sea-turtle-morphometrics' component={SeaTurtleMorphometrics} />
            <ProtectedRoute {...defaultProtectedRouteProps} path='/sea-turtle-morphometrics-graphs' component={SeaTurtleMorphometricsGraphs} />
            <ProtectedRoute {...defaultProtectedRouteProps} path='/holding-tanks' component={HoldingTanks} />
            <ProtectedRoute {...defaultProtectedRouteProps} path='/holding-tank-measurements' component={HoldingTankMeasurements} />
            <ProtectedRoute {...defaultProtectedRouteProps} path='/holding-tank-graphs' component={HoldingTankGraphs} />
            <ProtectedRoute {...defaultProtectedRouteProps} path='/hatchlings-events' component={HatchlingEvents} />
            <ProtectedRoute {...defaultProtectedRouteProps} path='/washbacks-events' component={WashbackEvents} />
            <ProtectedRoute {...defaultProtectedRouteProps} path='/reports' component={Reports} />
            <ProtectedRoute {...defaultProtectedRouteProps} path='/organization' component={Organization} />
            <Route path='/login' component={Login} />
            <Route component={NotFound} />
          </Switch>
          <div className='bottom-panel has-text-centered'>
            Copyright &copy; 2006-2020 <a href='http://www.turtlegeek.com' target='_blank' rel='noopener noreferrer' title='TurtleGeek.com'>TurtleGeek.com</a>
            &nbsp;|&nbsp;
            <a href='https://github.com/jaypalexa/roster' target='_blank' rel='noopener noreferrer' title='GitHub'>
              GitHub
            </a>
            &nbsp;|&nbsp;v0.20200424.1510
            {isShowUpdateAvailable ? <p><span>(</span><span className='span-link show-underline' onClick={onReloadPageClick}>update available</span><span>)</span></p> : null}
            {!isShowUpdateAvailable ? <p><span>(</span><span className='span-link show-underline' onClick={onCheckForUpdateClick}>check for update</span>{lastUpdateCheckDateTime ? <span> - last checked: {lastUpdateCheckDateTime}</span> : null}<span>)</span></p> : null}
          </div>
        </div>

      </Router>
      <ToastContainer
        autoClose={1200}
        position={toast.POSITION.BOTTOM_CENTER}
        transition={Slide}
        pauseOnHover={true}
        className='toast-container'
        toastClassName='toast-custom'
      />
    </div>
  );
}

export default App;
