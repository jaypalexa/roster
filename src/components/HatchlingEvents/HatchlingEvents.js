import React from 'react';
import { Link } from '@reach/router';
import Heading from 'react-bulma-components/lib/components/heading';
import './HatchlingEvents.sass';

export default () => (
  <div className='HatchlingEvents'>
    <Heading>Hatchling Events</Heading>
    <Link to='/'>Home</Link>
  </div>
);
