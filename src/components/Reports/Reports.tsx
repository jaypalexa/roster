import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthenticationService from 'services/AuthenticationService';
import ReportService from 'services/ReportService';
import ReportListItemModel from 'types/ReportListItemModel';
import ReportModel from 'types/ReportModel';
import { constants } from 'utils';
import ReportOptionsDialog from './ReportOptionsDialog';
import './Reports.sass';

const Reports: React.FC = () => {

  const [currentReport, setCurrentReport] = useState<ReportModel | null>();
  const [currentReportListItem, setCurrentReportListItem] = useState({} as ReportListItemModel);
  const [currentReportListItems, setCurrentReportListItems] = useState([] as Array<ReportListItemModel>);
  const [showReportOptionsDialog, setShowReportOptionsDialog] = useState(false);
  const [pdfData, setPdfData] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
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
      sortable: true
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

  const promptForReportOptions = (reportListItem: ReportListItemModel) => {
    AuthenticationService.updateUserActivity();
    setCurrentReportListItem(reportListItem);
    setShowReportOptionsDialog(true);
  };

  const generatePdfReport = async (reportListItem: ReportListItemModel, reportOptions: any) => {
    AuthenticationService.updateUserActivity();
    setCurrentReport(null);
    try {
      setShowSpinner(true)
      const report = await ReportService.generateReport(reportListItem, reportOptions);
      setCurrentReport(report);
      //setPdfData(`data:application/pdf;base64,${report.data}`);
      setPdfUrl(report.url);
      //console.log(report.url);
      window.open(report.url);
    }
    catch (err) {
      console.log(err);
      toast.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false)
    }
  };

  const onGenerateReportListItemClick = (reportListItem: ReportListItemModel, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (reportListItem.isPdf) {
      promptForReportOptions(reportListItem);
    }
    else {
      //toast.info(`The '${reportListItem.reportName}' is an HTML report`);
      alert(`TODO:  The '${reportListItem.reportName}' is an HTML report`);
      return;
    }
  };

  const onGenerate = (reportListItem: ReportListItemModel, reportOptions: any) => {
    setShowReportOptionsDialog(false);
    console.log('reportOptions', reportOptions);
    generatePdfReport(reportListItem, reportOptions)
  }

  return (
    <div id='reports'>
      <Spinner isActive={showSpinner} />
      <ReportOptionsDialog
        isActive={showReportOptionsDialog}
        reportListItem={currentReportListItem}
        onGenerate={onGenerate}
        onCancel={() => {
          setShowReportOptionsDialog(false);
        }}
      />

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

          {currentReport ? 
            <div>
              <a href={pdfUrl} title={currentReportListItem.reportName} target='_blank' rel='noopener noreferrer'>View Report</a>
              <object 
                style={{height: '85vh'}} 
                data={pdfData} 
                type='application/pdf' 
                width='100%' 
                height='100%'
                title={currentReport.reportName}
                name={currentReport.reportName}
              >
                  <a href={pdfUrl} title={currentReportListItem.reportName} target='_blank' rel='noopener noreferrer'>View Report</a>
              </object>
            </div>
           : null}
        </div>
      </div>
    </div>
  );
};

export default Reports;
