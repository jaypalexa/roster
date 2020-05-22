import browserHistory from 'browserHistory';
import ChildNavigation from 'components/ChildNavigation/ChildNavigation';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import ReportListItemModel from 'models/ReportListItemModel';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReportService from 'services/ReportService';
import './Reports.sass';

const Reports: React.FC = () => {
  const [currentReportListItems, setCurrentReportListItems] = useState([] as Array<ReportListItemModel>);
  const [showSpinner, setShowSpinner] = useState(false);

  useMount(() => {
    setShowSpinner(true);
    const listItems = ReportService.getReportList();
    setCurrentReportListItems(listItems);
    setShowSpinner(false);
  });

  const onChildNavigationClick = (reportListItem: ReportListItemModel) => {
    setTimeout(() => {
      browserHistory.push(`/report-options/${reportListItem.reportId}`);
    }, 0);
  };

  const renderChildNavigation = (reportListItem: ReportListItemModel) => {
    return <ChildNavigation 
              key={reportListItem.reportId} 
              itemName={reportListItem.reportName} 
              onClick={() => onChildNavigationClick(reportListItem)}
            />
  };

  return (
    <div id='reports'>
      <Spinner isActive={showSpinner} />
      <nav className='breadcrumb hidden-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li className='is-active'><a href='/#' aria-current='page'>Reports</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb hidden-when-not-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>&#10094; Home</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>

          <h1 className='title has-text-centered'>FWC Reports</h1>
          {currentReportListItems
            .filter(item => item.isPdf)
            .map((item) => renderChildNavigation(item))
          }

          <h1 className='title has-text-centered'>Other Reports</h1>
          {currentReportListItems
            .filter(item => !item.isPdf)
            .map((item) => renderChildNavigation(item))
          }
        </div>
      </div>
    </div>
  );
};

export default Reports;
