import React from 'react';
import { Link } from '@reach/router';
import './App.css';
import banner from './assets/images/roster-banner.gif';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <img src={banner} alt="banner" />
        <p>
          ROSTER (Record Of Sea Turtles Electronic Reports)
        </p>
        <p>
          collects marine turtle and holding tank data
        </p>
        <p>
          required by the Florida Fish and Wildlife Conservation Commission (FWC)
        </p>
        <Link to="/sea-turtles">Sea Turtles</Link>
        <a
          className="App-link"
          href="http://turtlegeek.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          TurtleGeek.com
        </a>
      </header>
    </div>
  );
}

export default App;
