import browserHistory from 'browserHistory';
import React from 'react';
import './Reports.sass';

const Reports: React.FC = () => {
  return (
    <div id='reports'>
      <div className='columns'>
        <div className='column has-text-centered'>
          <h1 className='title has-text-centered'>Reports</h1>
          <button className='button is-dark' onClick={() => browserHistory.push('/')}>Home</button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
