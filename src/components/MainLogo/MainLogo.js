import React from 'react';
import { Link } from '@reach/router';
import './MainLogo.sass';
import banner from '../../assets/images/roster-banner.gif';

export default () => (
  <Link to='/'><img src={banner} title='ROSTER' alt='ROSTER'/></Link>
);
