import React from 'react';
import browserHistory from '../../browserHistory';
import './WashbackEvents.sass';

const WashbackEvents: React.FC = () => {
  return (
    <div id='washback-events'>
      <div className='columns'>
        <div className='column has-text-centered'>
          <h1 className='title has-text-centered'>Washback Events</h1>
          <button className='button is-dark' onClick={() => browserHistory.push('/')}>Home</button>
        </div>
      </div>
    </div>
  );
};

export default WashbackEvents;
