import React from 'react';
import { Link } from '@reach/router';
import Heading from 'react-bulma-components/lib/components/heading';
import './Reports.sass';

export default () => (
  <div className='reports-component'>
    <Heading>Reports</Heading>
    <Link to='/'>Home</Link>
  </div>
);
