import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from '@reach/router';
import * as serviceWorker from './serviceWorker';
import App from './components/App/App';
import NotFound from './components/NotFound/NotFound';
import SeaTurtles from './components/SeaTurtles/SeaTurtles';
import 'bulma/css/bulma.css';
import './index.sass';

ReactDOM.render(
  <Router>
    <App path="/" />
    <SeaTurtles path="/sea-turtles" />
    <NotFound default />
  </Router>, 
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
