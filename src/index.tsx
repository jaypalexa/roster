import App from 'components/App/App';
import { AppContextProvider } from 'contexts/AppContext';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.sass';

ReactDOM.render(
  <AppContextProvider>
    <App />
  </AppContextProvider>
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.register();
