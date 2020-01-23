import HatchlingEvents from 'components/HatchlingEvents/HatchlingEvents';
import HoldingTanks from 'components/HoldingTanks/HoldingTanks';
import Home from 'components/Home/Home';
import Login from 'components/Login/Login';
import NotFound from 'components/NotFound/NotFound';
import Organization from 'components/Organization/Organization';
import ProtectedRoute, { ProtectedRouteProps } from 'components/ProtectedRoute/ProtectedRoute';
import Reports from 'components/Reports/Reports';
import SeaTurtles from 'components/SeaTurtles/SeaTurtles';
import React, { useState } from 'react';
import { Link, Route, Router, Switch } from 'react-router-dom';
import { Slide, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import browserHistory from '../../browserHistory';
import { useAppContext } from '../../contexts/AppContext';
import AuthenticationService from '../../services/AuthenticationService';
import './App.sass';

// import logo from './logo.svg';

const App: React.FC = () => {

  document.addEventListener('DOMContentLoaded', () => {
    const $navbarBurger = document.querySelector('.navbar-burger') as HTMLDivElement;
    $navbarBurger.addEventListener('click', () => {
      const target = $navbarBurger.dataset.target || '';
      const $target = document.getElementById(target) as HTMLDivElement;
      $navbarBurger.classList.toggle('is-active');
      $target.classList.toggle('is-active');
    });
  });
  
  const [appContext, setAppContext] = useAppContext();
  const [triggerRefresh, setTriggerRefresh] = useState(false);

  const closeMenu = () => {
    document.querySelector('.navbar-menu')?.classList.remove('is-active');
    document.querySelector('.navbar-burger')?.classList.remove('is-active');
  };

  const setRedirectPathOnAuthentication = (path: string) => {
    setAppContext({...appContext, redirectPathOnAuthentication: path});
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
              <Link className='navbar-item' to='/hatchling-events' onClick={closeMenu}>Hatchling Events</Link>
              <Link className='navbar-item' to='/reports' onClick={closeMenu}>Reports</Link>
              <Link className='navbar-item' to='/organization' onClick={closeMenu}>Organization</Link>
            </div>
            <div className='navbar-end'>
              <Link className={`navbar-item ${AuthenticationService.isAuthenticated ? 'hidden' : ''}`} to='/login' onClick={closeMenu}>Log In</Link>
              <span className={`navbar-item ${AuthenticationService.isAuthenticated ? '' : 'hidden'}`} >{AuthenticationService.loggedInUserName}</span>
              <span className={`navbar-item ${AuthenticationService.isAuthenticated ? '' : 'hidden'}`} >|</span>
              <Link className={`navbar-item ${AuthenticationService.isAuthenticated ? '' : 'hidden'}`} to='/login' onClick={logOut}>Log Out</Link>
            </div>
          </div>
        </nav>

        <div className='content-container'>
          <Switch>
            <ProtectedRoute {...defaultProtectedRouteProps} exact={true} path='/' component={Home} />
            <ProtectedRoute {...defaultProtectedRouteProps} path='/sea-turtles' component={SeaTurtles} />
            <ProtectedRoute {...defaultProtectedRouteProps} path='/holding-tanks' component={HoldingTanks} />
            <ProtectedRoute {...defaultProtectedRouteProps} path='/hatchling-events' component={HatchlingEvents} />
            <ProtectedRoute {...defaultProtectedRouteProps} path='/reports' component={Reports} />
            <ProtectedRoute {...defaultProtectedRouteProps} path='/organization' component={Organization} />
            <Route path='/login' component={Login} />
            <Route component={NotFound} />
          </Switch>
          <div className='has-text-centered bottom-panel'>
            <p>
              Copyright &copy; 2006-2020 <a href='http://www.turtlegeek.com' target='_blank' rel='noopener noreferrer' title='GitHub'>TurtleGeek.com</a>
              &nbsp;|&nbsp; 
              <a href='https://github.com/jaypalexa/roster' target='_blank' rel='noopener noreferrer' title='GitHub'>
                GitHub
              </a>
            </p>
          </div>
        </div>

      </Router>
      <ToastContainer 
        autoClose={20000} 
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
