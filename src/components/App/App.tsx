import HatchlingEvents from 'components/HatchlingEvents/HatchlingEvents';
import HoldingTanks from 'components/HoldingTanks/HoldingTanks';
import Home from 'components/Home/Home';
import MeasurementUnits from 'components/MeasurementUnits/MeasurementUnits';
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
  return (
    //<img src={logo} className='App-logo' alt='logo' />
    <div id='app'>
      <Router history={browserHistory}>
          <div className='columns'>
            <div className='column is-2 app-menu'>
              <div className='app-home' onClick={() => browserHistory.push('/')}>
                <span className='is-size-4'>ROSTER</span>
              </div>
              <div className='menu'>
                <p className='menu-label'>General</p>
                <ul className='menu-list'>
                  <li><Link to='/sea-turtles'>Sea Turtles</Link></li>
                  <li><Link to='/holding-tanks'>Holding Tanks</Link></li>
                  <li><Link to='/hatchling-events'>Hatchling Events</Link></li>
                  <li><Link to='/reports'>Reports</Link></li>
                </ul>
                <p className='menu-label'>Settings</p>
                  <ul className='menu-list'>
                    <li><Link to='/organization'>Organization</Link></li>
                    <li><Link to='/starting-balances'>Starting Balances</Link></li>
                    <li><Link to='/measurement-units'>Measurement Units</Link></li>
                  </ul>
              </div>
            </div>
            <div className='column'>
              <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/sea-turtles' component={SeaTurtles} />
                <Route path='/holding-tanks' component={HoldingTanks} />
                <Route path='/hatchling-events' component={HatchlingEvents} />
                <Route path='/reports' component={Reports} />
                <Route path='/organization' component={Organization} />
                <Route path='/measurement-units' component={MeasurementUnits} />
                <Route path='*' component={NotFound} />
              </Switch>
            </div>
          </div>
      </Router>
    </div>
  );
}

export default App;
