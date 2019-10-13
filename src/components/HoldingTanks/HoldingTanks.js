import React from 'react';
import { Link } from '@reach/router';
import Heading from 'react-bulma-components/lib/components/heading';
import './HoldingTanks.sass';

export default () => (
  <div className='HoldingTanks'>
    <Heading>Holding Tanks</Heading>
    <Link to='/'>Home</Link>
  </div>
);
