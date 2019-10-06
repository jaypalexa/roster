import React from 'react';
import { Link } from '@reach/router';
import './NotFound.css';

function NotFound() {
  return (
    <div className="NotFound">
      <header className="NotFound-header">
        <p>
          Not Found
        </p>
        <Link to="/">Home</Link>
      </header>
    </div>
  );
}

export default NotFound;
