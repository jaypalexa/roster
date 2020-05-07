import browserHistory from 'browserHistory';
import HatchlingEvents from 'components/HatchlingsEvents/HatchlingsEvents';
import HoldingTankGraphs from 'components/HoldingTankGraphs/HoldingTankGraphs';
import HoldingTankMeasurements from 'components/HoldingTankMeasurements/HoldingTankMeasurements';
import HoldingTanks from 'components/HoldingTanks/HoldingTanks';
import Home from 'components/Home/Home';
import Login from 'components/Login/Login';
import NotFound from 'components/NotFound/NotFound';
import Organization from 'components/Organization/Organization';
import ProtectedRoute from 'components/ProtectedRoute/ProtectedRoute';
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
import ApiService from 'services/ApiService';
import AuthenticationService from 'services/AuthenticationService';
import * as serviceWorker from 'serviceWorker';
import './App.sass';

const App: React.FC = () => {

  const [lastUpdateCheckDateTime, setLastUpdateCheckDateTime] = useState<string | null>(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isShowUpdateAvailable, setIsShowUpdateAvailable] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [loggedInUserName, setLoggedInUserName] = useState('');
  const [newServiceWorker, setNewServiceWorker] = useState<ServiceWorker | null>(null);

  const onReloadPageClick = () => {
    console.log('onReloadPageClick::newServiceWorker = ', newServiceWorker);
    if (newServiceWorker) {
      newServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      if ('serviceWorker' in navigator) {
        console.log('onReloadPageClick::\'serviceWorker\' in navigator...');
        navigator.serviceWorker.ready.then(registration => {
          console.log('onReloadPageClick::registration.update().then()::registration = ', registration);
          const serviceWorker = (registration.installing || registration.waiting);
          console.log('onReloadPageClick::registration.update().then()::serviceWorker = ', serviceWorker);
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

  const logOut = () => {
    setLoggedInUserName('');
    AuthenticationService.signOut();
    closeMenu();
    setTriggerRefresh(!triggerRefresh);
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

  useMount(() => {
    if (AuthenticationService.isUserAuthenticated()) {
      setLoggedInUserName(AuthenticationService.getUserName());
    }
  });

  useMount(() => {
    ApiService.wakeup();
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
              <Link className={`navbar-item ${loggedInUserName ? 'hidden' : ''}`} to='/login' onClick={closeMenu}>Log In</Link>
              <span className={`navbar-item ${loggedInUserName ? '' : 'hidden'} is-hidden-mobile`} >{loggedInUserName}</span>
              <span className={`navbar-item ${loggedInUserName ? '' : 'hidden'} is-hidden-mobile`} >|</span>
              <Link className={`navbar-item ${loggedInUserName ? '' : 'hidden'}`} to='/login' onClick={logOut}>Log Out</Link>
            </div>
          </div>
        </nav>

        <div className='content-container'>
          <Switch>
            <ProtectedRoute setLoggedInUserName={setLoggedInUserName} exact={true} path='/' component={Home} />
            <ProtectedRoute setLoggedInUserName={setLoggedInUserName} path='/sea-turtles' component={SeaTurtles} />
            <ProtectedRoute setLoggedInUserName={setLoggedInUserName} path='/sea-turtle-tags' component={SeaTurtleTags} />
            <ProtectedRoute setLoggedInUserName={setLoggedInUserName} path='/sea-turtle-morphometrics' component={SeaTurtleMorphometrics} />
            <ProtectedRoute setLoggedInUserName={setLoggedInUserName} path='/sea-turtle-morphometrics-graphs' component={SeaTurtleMorphometricsGraphs} />
            <ProtectedRoute setLoggedInUserName={setLoggedInUserName} path='/holding-tanks' component={HoldingTanks} />
            <ProtectedRoute setLoggedInUserName={setLoggedInUserName} path='/holding-tank-measurements' component={HoldingTankMeasurements} />
            <ProtectedRoute setLoggedInUserName={setLoggedInUserName} path='/holding-tank-graphs' component={HoldingTankGraphs} />
            <ProtectedRoute setLoggedInUserName={setLoggedInUserName} path='/hatchlings-events' component={HatchlingEvents} />
            <ProtectedRoute setLoggedInUserName={setLoggedInUserName} path='/washbacks-events' component={WashbackEvents} />
            <ProtectedRoute setLoggedInUserName={setLoggedInUserName} path='/reports' component={Reports} />
            <ProtectedRoute setLoggedInUserName={setLoggedInUserName} path='/organization' component={Organization} />
            <Route path='/login' render={ (routeProps) => <Login {...{setLoggedInUserName, ...routeProps}} /> } />
            <Route component={NotFound} />
          </Switch>
          <div className='bottom-panel has-text-centered'>
            Copyright &copy; 2006-2020 <a href='http://www.turtlegeek.com' target='_blank' rel='noopener noreferrer' title='TurtleGeek.com'>TurtleGeek.com</a>
            &nbsp;|&nbsp;
            <a href='https://github.com/jaypalexa/roster' target='_blank' rel='noopener noreferrer' title='GitHub'>
              GitHub
            </a>
            &nbsp;|&nbsp;v0.20200507.1130
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
