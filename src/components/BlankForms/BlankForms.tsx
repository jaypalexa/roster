import ChildNavigation from 'components/ChildNavigation/ChildNavigation';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import ReportDefinitionModel from 'models/ReportDefinitionModel';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthenticationService from 'services/AuthenticationService';
import ReportService from 'services/ReportService';
import './BlankForms.sass';

const BlankForms: React.FC = () => {
  const [reportDefinitions, setReportDefinitions] = useState([] as Array<ReportDefinitionModel>);
  const [showSpinner, setShowSpinner] = useState(false);

  useMount(() => {
    setShowSpinner(true);
    const definitions = ReportService.getBlankFormList();
    setReportDefinitions(definitions);
    setShowSpinner(false);
  });

  const onChildNavigationClick = (reportDefinition: ReportDefinitionModel) => {
    AuthenticationService.updateUserActivity();
    const url = `https://www.turtlegeek.com/pdf/roster/${reportDefinition.blankFileName}`;
    window.open(url);
  };

  const renderChildNavigation = (reportDefinition: ReportDefinitionModel) => {
    return <ChildNavigation 
              key={reportDefinition.reportId} 
              itemName={reportDefinition.reportName} 
              onClick={() => onChildNavigationClick(reportDefinition)}
            />
  };

  return (
    <div id='blankForms'>
      <Spinner isActive={showSpinner} />
      <nav className='breadcrumb hidden-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li className='is-active'><a href='/#' aria-current='page'>Blank Forms</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb hidden-when-not-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>&#10094; Home</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>Blank Forms</h1>
          <h2 className='subtitle has-text-centered'>(opens in new tab)</h2>
          {reportDefinitions
            .map((item) => renderChildNavigation(item))
          }
        </div>
      </div>
    </div>
  );
};

export default BlankForms;
