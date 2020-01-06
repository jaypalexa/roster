import HatchlingEvents from 'components/HatchlingEvents/HatchlingEvents';
import HoldingTanks from 'components/HoldingTanks/HoldingTanks';
import Home from 'components/Home/Home';
import MeasurementUnits from 'components/MeasurementUnits/MeasurementUnits';
import NotFound from 'components/NotFound/NotFound';
import Organization from 'components/Organization/Organization';
import Reports from 'components/Reports/Reports';
import SeaTurtles from 'components/SeaTurtles/SeaTurtles';
import React from 'react';
import { Menu } from 'react-bulma-components';
import { Route, Router, Switch } from 'react-router-dom';
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
              <Menu>
                <Menu.List title='General'>
                  <Menu.List.Item onClick={() => browserHistory.push('/sea-turtles')}>
                    Sea Turtles
                  </Menu.List.Item>
                  <Menu.List.Item onClick={() => browserHistory.push('/holding-tanks')}>
                    Holding Tanks
                  </Menu.List.Item>
                  <Menu.List.Item onClick={() => browserHistory.push('/hatchling-events')}>
                    Hatchling Events
                  </Menu.List.Item>
                  <Menu.List.Item onClick={() => browserHistory.push('/reports')}>
                    Reports
                  </Menu.List.Item>
                </Menu.List>
                <Menu.List title='Settings'>
                  <Menu.List.Item onClick={() => browserHistory.push('/organization')}>
                    Organization
                  </Menu.List.Item>
                  <Menu.List.Item onClick={() => browserHistory.push('/starting-balances')}>
                    Starting Balances
                  </Menu.List.Item>
                  <Menu.List.Item onClick={() => browserHistory.push('/measurement-units')}>
                    Measurement Units
                  </Menu.List.Item>
                </Menu.List>
              </Menu>
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
