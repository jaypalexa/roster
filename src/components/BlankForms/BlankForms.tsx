import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import ReportListItemModel from 'models/ReportListItemModel';
import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthenticationService from 'services/AuthenticationService';
import ReportService from 'services/ReportService';
import './BlankForms.sass';

const BlankForms: React.FC = () => {
  const [currentReportListItems, setCurrentReportListItems] = useState([] as Array<ReportListItemModel>);
  const [showSpinner, setShowSpinner] = useState(false);

  const tableColumns = [
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      style: '{padding-left: 1rem}',
      cell: (row: ReportListItemModel) => <span className='icon cursor-pointer' onClick={(event) => { onBlankReportListItemClick(row, event) }}><i className={`fa ${row.isPdf && row.blankFileName ? 'fa-external-link' : ''}`} title='Open in new tab'></i></span>,
    },
    {
      name: 'Name',
      selector: 'reportName',
      sortable: true
    },
  ];

  const tableCustomStyles = {
    headRow: {
      style: {
        paddingRight: '1.1rem'
      }
    },
    headCells: {
      style: {
        fontSize: 'large'
      }
    },
    table: {
      style: {
        height: '100%'
      }
    },
    cells: {
      style: {
        fontSize: 'large'
      }
    },
  };

  useMount(() => {
    window.scrollTo(0, 0)
  });

  useMount(() => {
    setShowSpinner(true);
    const listItems = ReportService.getBlankFormList();
    setCurrentReportListItems(listItems);
    setShowSpinner(false);
  });

  const showBlankReport = (reportListItem: ReportListItemModel) => {
    AuthenticationService.updateUserActivity();
    if (!reportListItem.isPdf) {
      toast.info(`The '${reportListItem.reportName}' is an HTML report`);
      return;
    }
    const url = `https://www.turtlegeek.com/pdf/roster/${reportListItem.blankFileName}`;
    window.open(url);
  };

  const onBlankReportListItemClick = (reportListItem: ReportListItemModel, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    showBlankReport(reportListItem);
  };

  return (
    <div id='blankForms'>
      <Spinner isActive={showSpinner} />

      <nav className='breadcrumb shown-when-not-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li className='is-active'><a href='/#' aria-current='page'>Blank Forms</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb shown-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>&#10094; Home</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered hidden-when-mobile'>Blank Forms</h1>

          <DataTable
            title='Blank Forms'
            columns={tableColumns}
            data={currentReportListItems}
            keyField='reportId'
            defaultSortField='reportName'
            noHeader={true}
            customStyles={tableCustomStyles}
          />
          
        </div>
      </div>
    </div>
  );
};

export default BlankForms;
