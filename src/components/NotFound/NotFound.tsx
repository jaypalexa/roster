import browserHistory from '../../browserHistory';
import React from 'react';
import { Button, Heading } from 'react-bulma-components';
import './NotFound.sass';

const NotFound: React.FC = () => {
  return (
    <div id='not-found' className='has-text-centered'>
      <Heading>Not Found</Heading>
      <Button color='danger' onClick={() => browserHistory.push('/')}>Home</Button>
    </div>
  );
};

export default NotFound;
