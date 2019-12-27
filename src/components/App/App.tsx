import browserHistory from '../../browserHistory';
import HatchlingEvents from 'components/HatchlingEvents/HatchlingEvents';
import HoldingTanks from 'components/HoldingTanks/HoldingTanks';
import Home from '../Home/Home';
import NotFound from '../NotFound/NotFound';
import React from 'react';
import Reports from 'components/Reports/Reports';
import SeaTurtles from 'components/SeaTurtles/SeaTurtles';
import { Route, Router, Switch } from 'react-router-dom';
import './App.sass';

// import logo from './logo.svg';

//const App: React.FC = () => {
function App() {
  return (
    //<img src={logo} className="App-logo" alt="logo" />
    <div id='app'>
      <Router history={browserHistory}>
        <div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/sea-turtles" component={SeaTurtles} />
            <Route path="/holding-tanks" component={HoldingTanks} />
            <Route path="/hatchling-events" component={HatchlingEvents} />
            <Route path="/reports" component={Reports} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
