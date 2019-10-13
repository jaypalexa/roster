import React from 'react';
import { render } from 'react-dom';
import { Router } from '@reach/router';
import * as serviceWorker from './serviceWorker';
import Home from './components/Home/Home';
import MainLogo from './components/MainLogo/MainLogo';
import NotFound from './components/NotFound/NotFound';
import SeaTurtles from './components/SeaTurtles/SeaTurtles';
import 'bulma/css/bulma.css';
import './index.sass';

render(
  <div>
    <MainLogo />
    <Router>
      <Home path="/" />
      <SeaTurtles path="/sea-turtles" />
      <NotFound default />
    </Router>
  </div>, 
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
