import logo from './logo.svg';
import React from 'react';
import { Button } from 'react-bulma-components';
import './App.sass';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a 
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Button color="primary">My Bulma button</Button>
      </header>
    </div>
  );
}

export default App;
