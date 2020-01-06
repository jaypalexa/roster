import React from 'react';
import browserHistory from '../../browserHistory';
import './SeaTurtles.sass';

const SeaTurtles: React.FC = () => {
  return (
    <div id='sea-turtles'>
      <div className='columns'>
        <div className='column is-four-fifths has-text-centered'>
          <h1 className='title has-text-centered'>Sea Turtles</h1>
          <button className='button is-dark' onClick={() => browserHistory.push('/')}>Home</button>
        </div>
      </div>
    </div>
  );
};

export default SeaTurtles;
