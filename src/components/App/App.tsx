import HatchlingEvents from 'components/HatchlingEvents/HatchlingEvents';
import HoldingTanks from 'components/HoldingTanks/HoldingTanks';
import Home from 'components/Home/Home';
import NotFound from 'components/NotFound/NotFound';
import Organization from 'components/Organization/Organization';
import Reports from 'components/Reports/Reports';
import SeaTurtles from 'components/SeaTurtles/SeaTurtles';
import React from 'react';
import { Link, Route, Router, Switch } from 'react-router-dom';
import browserHistory from '../../browserHistory';
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

  const closeMenu = () => {
    document.querySelector('.navbar-menu')?.classList.remove('is-active');
    document.querySelector('.navbar-burger')?.classList.remove('is-active');
  };

  return (
    //<img src={logo} className='App-logo' alt='logo' />
    <div id='app'>
      <Router history={browserHistory}>
        <nav className='navbar is-dark' aria-label='main navigation'>
          <div className='navbar-brand'>
            <Link className='navbar-item' to='/' onClick={closeMenu}>ROSTER</Link>
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
              <Link className='navbar-item' to='/login' onClick={closeMenu}>Log In</Link>
            </div>
          </div>
        </nav>

        <div className='content-container'>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/sea-turtles' component={SeaTurtles} />
            <Route path='/holding-tanks' component={HoldingTanks} />
            <Route path='/hatchling-events' component={HatchlingEvents} />
            <Route path='/reports' component={Reports} />
            <Route path='/organization' component={Organization} />
            <Route path='*' component={NotFound} />
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
    </div>
  );
}

export default App;
