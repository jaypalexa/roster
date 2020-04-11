import browserHistory from '../../browserHistory';
import React from 'react';
import './HatchlingAndWashbackEvents.sass';

const HatchlingEvents: React.FC = () => {
  return (
    <div id='hatchling-events'>
      <div className='columns'>
        <div className='column has-text-centered'>
          <h1 className='title has-text-centered'>Hatchling and Washback Events</h1>
          <button className='button is-dark' onClick={() => browserHistory.push('/')}>Home</button>
        </div>
      </div>
    </div>
  );
};

export default HatchlingEvents;
