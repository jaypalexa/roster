import React from 'react';
import browserHistory from '../../browserHistory';
import './HatchlingEvents.sass';

const HatchlingEvents: React.FC = () => {
  return (
    <div id='hatchling-events'>
      <div className='columns'>
        <div className='column is-four-fifths has-text-centered'>
          <h1 className='title has-text-centered'>Hatchling Events</h1>
          <button className='button is-dark' onClick={() => browserHistory.push('/')}>Home</button>
        </div>
      </div>
    </div>
  );
};

export default HatchlingEvents;
