import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import ReportListItemModel from 'models/ReportListItemModel';
import ReportRouteStateModel from 'models/ReportRouteStateModel';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReportService from 'services/ReportService';
import { constants, iOS } from 'utils';
import './Report.sass';
import TurtleInjuryReportGenerator from './TurtleInjuryReportGenerator';
import TurtleTagReportGenerator from './TurtleTagReportGenerator';

const Report: React.FC = () => {
  const [currentReportListItem, setCurrentReportListItem] = useState({} as ReportListItemModel);
  const [reportOptions, setReportOptions] = useState<any>();
  const [pdfReportUrl, setPdfReportUrl] = useState<string>();
  const [showHtmlReport, setShowHtmlReport] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [htmlReportContent, setHtmlReportContent] = useState<JSX.Element>(<></>);
  const reportRouteState = useLocation().state as ReportRouteStateModel;

  useMount(() => {
    window.scrollTo(0, 0);
  });

  useMount(() => {
    setCurrentReportListItem(reportRouteState.currentReportListItem);
    setReportOptions(reportRouteState.reportOptions);
  });

  useEffect(() => {
    if (!currentReportListItem.reportId || !reportOptions) return;
    const generateReport = async (reportOptions: any) => {
      try {
        setShowSpinner(true)
        if (currentReportListItem.isPdf) {
          const report = await ReportService.generatePdfReport(currentReportListItem, reportOptions);
          setPdfReportUrl(report.url);
        } else {
          let content = <></>;
          switch (currentReportListItem.reportId) {
            case 'TurtleInjuryReport':
              content = await TurtleInjuryReportGenerator.generateReport(currentReportListItem, reportOptions);
              break;
            case 'TurtleTagReport':
              content = await TurtleTagReportGenerator.generateReport(currentReportListItem, reportOptions);
              break;
            default:
              break;
          }
          setHtmlReportContent(content);
          setShowHtmlReport(true);
        }
      }
      catch (err) {
        console.log(err);
        toast.error(constants.ERROR.GENERIC);
      }
      finally {
        setShowSpinner(false);
      }
    }
    generateReport(reportOptions);
  }, [reportOptions, currentReportListItem]);

  return (
    <div id='report'>
      <Spinner isActive={showSpinner} />
      <nav className='breadcrumb hidden-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/reports'>Reports</Link></li>
          <li><Link to={`/report-options/${currentReportListItem.reportId}`}>Report Options</Link></li>
          <li className='is-active'><a href='/#' aria-current='page'>{currentReportListItem.reportName}</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb hidden-when-not-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to={`/report-options/${currentReportListItem.reportId}`}>&#10094; Report Options</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>

          {pdfReportUrl ? 
            <>
              <h1 className='title has-text-centered'>{currentReportListItem.reportName}</h1>
              <div className='view-report-button-container has-text-centered'>
                <a href={pdfReportUrl} 
                  className='view-report-button is-centered-both' 
                  title={currentReportListItem.reportName} 
                  target={iOS ? '_self' : '_blank'} 
                  rel='noopener noreferrer'
                >
                    <span>View Report</span><br /><span>(opens in new tab)</span>
                </a>
              </div>
            </>
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
