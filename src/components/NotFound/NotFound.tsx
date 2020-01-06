import React from 'react';
import browserHistory from '../../browserHistory';
import './NotFound.sass';

const NotFound: React.FC = () => {
  return (
    <div id='not-found'>
      <div className='columns'>
        <div className='column is-four-fifths has-text-centered'>
          <h1 className='title has-text-centered'>Not Found</h1>
          <button className='button is-danger' onClick={() => browserHistory.push('/')}>Home</button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
