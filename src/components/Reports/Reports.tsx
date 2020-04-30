import browserHistory from 'browserHistory';
import React from 'react';
import OrganizationService from 'services/OrganizationService';
import './Reports.sass';

const Reports: React.FC = () => {
  return (
    <div id='reports'>
      <div className='columns'>
        <div className='column has-text-centered'>
          <h1 className='title has-text-centered'>Reports</h1>
          <button className='button is-dark' onClick={() => browserHistory.push('/')}>Home</button>
          <h2 className='subtitle has-text-centered'>TEST</h2>
          <button className='button' onClick={OrganizationService.getOrganization}>TEST</button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
