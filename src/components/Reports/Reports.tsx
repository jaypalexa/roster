import browserHistory from '../../browserHistory';
import React from 'react';
import { Button } from 'react-bulma-components';
import { Heading } from 'react-bulma-components';
import './Reports.sass';

const Reports: React.FC = () => {
  return (
    <div id='reports' className='reports-component'>
      <Heading>Reports</Heading>
      <Button color='dark' onClick={() => browserHistory.push('/')}>Home</Button>
    </div>
  );
};

export default Reports;
