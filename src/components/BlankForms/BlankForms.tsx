import ChildNavigation from 'components/ChildNavigation/ChildNavigation';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import ReportListItemModel from 'models/ReportListItemModel';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthenticationService from 'services/AuthenticationService';
import ReportService from 'services/ReportService';
import './BlankForms.sass';

const BlankForms: React.FC = () => {
  const [currentReportListItems, setCurrentReportListItems] = useState([] as Array<ReportListItemModel>);
  const [showSpinner, setShowSpinner] = useState(false);

  useMount(() => {
    setShowSpinner(true);
    const listItems = ReportService.getBlankFormList();
    setCurrentReportListItems(listItems);
    setShowSpinner(false);
  });

  const onChildNavigationClick = (reportListItem: ReportListItemModel) => {
    AuthenticationService.updateUserActivity();
    if (!reportListItem.isPdf) {
      toast.info(`The '${reportListItem.reportName}' is an HTML report`);
      return;
    }
    const url = `https://www.turtlegeek.com/pdf/roster/${reportListItem.blankFileName}`;
    window.open(url);
  };

  const renderChildNavigation = (reportListItem: ReportListItemModel) => {
    return <ChildNavigation 
              key={reportListItem.reportId} 
              itemName={reportListItem.reportName} 
              onClick={() => onChildNavigationClick(reportListItem)}
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
          {currentReportListItems
            .map((item) => renderChildNavigation(item))
          }
          
        </div>
      </div>
    </div>
  );
};

export default BlankForms;
