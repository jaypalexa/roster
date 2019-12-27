import browserHistory from '../../browserHistory';
import React from 'react';
import { Button } from 'react-bulma-components';
import { Heading } from 'react-bulma-components';
import './HatchlingEvents.sass';

const HatchlingEvents: React.FC = () => {
  return (
    <div id='hatchling-events' className='hatchling-events-component'>
      <Heading>Hatchling Events</Heading>
      <Button color='dark' onClick={() => browserHistory.push('/')}>Home</Button>
    </div>
  );
};

export default HatchlingEvents;
