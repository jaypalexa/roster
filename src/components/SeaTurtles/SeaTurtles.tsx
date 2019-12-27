import browserHistory from '../../browserHistory';
import React from 'react';
import { Button } from 'react-bulma-components';
import { Heading } from 'react-bulma-components';
import './SeaTurtles.sass';

const SeaTurtles: React.FC = () => {
  return (
    <div id='sea-turtles' className='sea-turtles-component'>
      <Heading>Sea Turtles</Heading>
      <Button color='dark' onClick={() => browserHistory.push('/')}>Home</Button>
    </div>
  );
};

export default SeaTurtles;
