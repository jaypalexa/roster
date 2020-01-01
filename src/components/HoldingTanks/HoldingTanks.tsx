import browserHistory from '../../browserHistory';
import React from 'react';
import { Button, Heading } from 'react-bulma-components';
import './HoldingTanks.sass';

const HoldingTanks: React.FC = () => {
  return (
    <div id='holding-tanks' className='holding-tanks-component'>
      <Heading>Holding Tanks</Heading>
      <Button color='dark' onClick={() => browserHistory.push('/')}>Home</Button>
    </div>
  );
};

export default HoldingTanks;
