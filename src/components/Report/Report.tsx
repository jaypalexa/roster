import ReportOptions from 'components/ReportOptions/ReportOptions';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import ReportListItemModel from 'models/ReportListItemModel';
import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { Link, RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthenticationService from 'services/AuthenticationService';
import ReportService from 'services/ReportService';
import { constants, iOS } from 'utils';
import './Report.sass';
import TurtleInjuryReport from './TurtleInjuryReport';

type ReportParams = { reportId: string };

const Report: React.FC<RouteComponentProps<ReportParams>> = ({match}) => {
  const methods = useForm<any>({ mode: 'onChange' });
  const { handleSubmit } = methods;
  const [currentReportListItem, setCurrentReportListItem] = useState({} as ReportListItemModel);
  const [pdfReportUrl, setPdfReportUrl] = useState<string>();
  const [showHtmlReport, setShowHtmlReport] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [htmlReportContent, setHtmlReportContent] = useState<JSX.Element>(<></>);

  useMount(() => {
    window.scrollTo(0, 0)
  });

  useMount(() => {
    const fetchReportListItem = async () => {
      try {
        setShowSpinner(true);
        const reportListItem = ReportService.getReportListItem(match.params.reportId);
        setCurrentReportListItem(reportListItem);
      } 
      catch (err) {
        console.log(err);
        toast.error(constants.ERROR.GENERIC);
      }
      finally {
        setShowSpinner(false);
      }
    };
    fetchReportListItem();
  });

  const clearViewingArea = () => {
    setPdfReportUrl('');
    setShowHtmlReport(false);
  };

  const generateHtmlReport = async (reportOptions: any) => {
    switch (currentReportListItem.reportId) {
      case 'TurtleInjuryReport':
        setHtmlReportContent(<TurtleInjuryReport currentReportListItem={currentReportListItem} reportOptions={reportOptions} setShowSpinner={setShowSpinner} />)
        break;
    
      default:
        setHtmlReportContent(<></>)
        break;
    }

    setShowHtmlReport(true);
  };

  const generatePdfReport = async (reportOptions: any) => {
    const report = await ReportService.generateReport(currentReportListItem, reportOptions);
    setPdfReportUrl(report.url);
  };

  const onSubmit = handleSubmit(async (reportOptions: any) => {
    console.log('reportOptions', reportOptions);
    try {
      setShowSpinner(true)
      AuthenticationService.updateUserActivity();
      clearViewingArea();
      if (currentReportListItem.isPdf) {
        await generatePdfReport(reportOptions);
      } else {
        await generateHtmlReport(reportOptions);
      }
    }
    catch (err) {
      console.log(err);
      toast.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false)
    }
  });

  return (
    <div id='report'>
      <Spinner isActive={showSpinner} />
      <nav className='breadcrumb shown-when-not-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/reports'>Reports</Link></li>
          <li className='is-active'><a href='/#' aria-current='page'>{currentReportListItem.reportName}</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb shown-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/reports'>&#10094; Reports</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <div className='report-options'>
            <h1 className='title has-text-centered'>{currentReportListItem.reportName} Options</h1>
            <FormContext {...methods} >
              <form onSubmit={onSubmit}>
                <ReportOptions currentReportListItem={currentReportListItem} setShowSpinner={setShowSpinner} />
                <div className='field is-grouped form-action-buttons'>
                  <p className='control'>
                    <input type='submit' className='button is-success is-fixed-width-medium' value='Generate' />
                  </p>
                </div>
              </form>
            </FormContext>
            <hr />
          </div>

          {pdfReportUrl ? 
            <div className='view-report-button-container has-text-centered'>
              <a href={pdfReportUrl} 
                className='view-report-button is-fixed-width-medium' 
                title={currentReportListItem.reportName} 
                target={iOS ? '_self' : '_blank'} 
                rel='noopener noreferrer'
              >
                  View Report
              </a>
            </div>
           : null}

           {showHtmlReport ?
            <>
            <div className='has-text-centered html-report-print-button-container'>
              <input
                type='button'
                className='button is-fixed-width-medium html-report-print-button'
                value='Print' 
                onClick={() => { window.print() }}
              />
            </div>
            <div className='has-text-centered html-report-viewing-area'>
              {htmlReportContent}
            </div>
            </>
           : null}
        </div>
      </div>
    </div>
  );
};

export default Report;
