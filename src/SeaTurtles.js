import React from 'react';
import { Link } from '@reach/router';
import './SeaTurtles.sass';

function SeaTurtles() {
  return (
    <div className="SeaTurtles">
      <header className="SeaTurtles-header">
        {/* <img src={logo} className="SeaTurtles-logo" alt="logo" /> */}
        <p>
          Sea Turtles
        </p>
        <Link to="/">Home</Link>
      </header>
    </div>
  );
}

export default SeaTurtles;
