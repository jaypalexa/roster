import React from 'react';
import { Link } from '@reach/router';
import Heading from 'react-bulma-components/lib/components/heading';
import './NotFound.sass';

export default () => (
  <div className='not-found-component'>
    <Heading>Not Found</Heading>
    <Link to='/'>Home</Link>
  </div>
);
