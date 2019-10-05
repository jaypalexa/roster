import React from 'react';
import logo from './assets/images/logo.svg';
import banner from './assets/images/roster-banner.gif';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <img src={banner} alt="banner" />
        <p>
          ROSTER (Record Of Sea Turtles Electronic Reports) collects marine turtle and holding tank data required by the Florida Fish and Wildlife Conservation Commission (FWC).
        </p>
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
