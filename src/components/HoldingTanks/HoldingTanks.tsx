import React from 'react';
import browserHistory from '../../browserHistory';
import './HoldingTanks.sass';

const HoldingTanks: React.FC = () => {
  return (
    <div id='holding-tanks' className='has-text-centered'>
      <h1 className='title has-text-centered'>Holding Tanks</h1>
      <button className='button is-dark' onClick={() => browserHistory.push('/')}>Home</button>
    </div>
  );
};

export default HoldingTanks;
