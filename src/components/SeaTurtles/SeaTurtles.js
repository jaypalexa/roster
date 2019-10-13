import React from 'react';
import { Link } from '@reach/router';
import Heading from 'react-bulma-components/lib/components/heading';
import './SeaTurtles.sass';

export default () => (
  <div className='sea-turtles-component'>
    <Heading>Sea Turtles</Heading>
    <Link to='/'>Home</Link>
  </div>
);
