import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthenticationService from 'services/AuthenticationService';
import ReportService from 'services/ReportService';
import ReportListItemModel from 'types/ReportListItemModel';
import { constants } from 'utils';
import './Reports.sass';

const Reports: React.FC = () => {

  const [currentReportListItem, setCurrentReportListItem] = useState({} as ReportListItemModel);
  const [currentReportListItems, setCurrentReportListItems] = useState([] as Array<ReportListItemModel>);
  const [pdfData, setPdfData] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);

  const tableColumns = [
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      style: '{padding-left: 1rem}',
      cell: (row: ReportListItemModel) => <span className='icon cursor-pointer' onClick={(event) => { onBlankReportListItemClick(row, event) }}><i className={`fa ${row.isPdf && row.blankFileName ? 'fa-external-link' : ''}`} title='Blank Form'></i></span>,
    },
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      cell: (row: ReportListItemModel) => <span className='icon cursor-pointer' onClick={(event) => { onGenerateReportListItemClick(row, event) }}><i className={`fa ${row.canGenerate ? 'fa-print' : ''}`} title='Generate Report'></i></span>,
    },
    {
      name: 'Name',
      selector: 'reportName',
      sortable: true
    },
    {
      name: 'Type',
      maxWidth: '4.5rem',
      minWidth: '4.5rem',
      style: '{padding-right: 4rem}',
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
    const listItems = ReportService.getList();
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

  const generateReport = async (reportListItem: ReportListItemModel) => {
    setCurrentReportListItem({} as ReportListItemModel);
    try {
      if (!reportListItem.isPdf) {
        toast.info(`The '${reportListItem.reportName}' is an HTML report`);
        return;
      }
      setShowSpinner(true)
      setCurrentReportListItem(reportListItem);
      const report = await ReportService.getReport(reportListItem.reportId);
      setPdfData(`data:application/pdf;base64,${report.data}`);
      setPdfUrl(report.url);
      // window.open(report.url);
    }
    catch (err) {
      console.log(err);
      toast.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false)
    }
  };

  const onBlankReportListItemClick = (reportListItem: ReportListItemModel, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    showBlankReport(reportListItem);
  };

  const onGenerateReportListItemClick = (reportListItem: ReportListItemModel, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    generateReport(reportListItem);
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

          <hr />

          {currentReportListItem.reportId ? 
            <div>
              <object 
                style={{height: '85vh'}} 
                data={pdfData} 
                type='application/pdf' 
                width='100%' 
                height='100%'
                title={currentReportListItem.reportName}
                name={currentReportListItem.reportName}
              >
                  <a href={pdfUrl} title='report'>View Report</a>
              </object>
            </div>
           : null}
        </div>
      </div>
    </div>
  );
};

export default Reports;
