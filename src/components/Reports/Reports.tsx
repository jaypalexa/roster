import browserHistory from 'browserHistory';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import ReportListItemModel from 'models/ReportListItemModel';
import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import ReportService from 'services/ReportService';
import './Reports.sass';

const Reports: React.FC = () => {
  const [currentReportListItems, setCurrentReportListItems] = useState([] as Array<ReportListItemModel>);
  const [showSpinner, setShowSpinner] = useState(false);

  const tableColumns = [
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      cell: (row: ReportListItemModel) => <span className='icon cursor-pointer' onClick={(event) => { onGenerateReportListItemClick(row, event) }}><i className='fa fa-print' title='Generate Report'></i></span>,
    },
    {
      name: 'Name',
      selector: 'reportName',
      sortable: true,
      cell: (row: ReportListItemModel) => <a href={`/report/${row.reportId}`}>{row.reportName}</a>,
    },
    {
      name: 'Type',
      maxWidth: '4.5rem',
      minWidth: '4.5rem',
      style: '{padding-right: 3.9rem}',
      cell: (row: ReportListItemModel) => <i className={`fa ${row.isPdf ? 'fa-file-pdf-o' : 'fa-file-code-o'}`} title={row.isPdf ? 'PDF' : 'HTML'}></i>,
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
    const listItems = ReportService.getReportList();
    setCurrentReportListItems(listItems);
    setShowSpinner(false);
  });

  const onGenerateReportListItemClick = (reportListItem: ReportListItemModel, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    setTimeout(() => {
      browserHistory.push(`/report/${reportListItem.reportId}`);
    }, 0);
    return;
  };

  return (
    <div id='reports'>
      <Spinner isActive={showSpinner} />
      <nav className='breadcrumb shown-when-not-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li className='is-active'><a href='/#' aria-current='page'>Reports</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb shown-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>&#10094; Home</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered hidden-when-mobile'>Reports</h1>

          <DataTable
            title='Reports'
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

export default Reports;
