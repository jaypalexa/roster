import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import ReportDefinitionModel from 'models/ReportDefinitionModel';
import ReportRouteStateModel from 'models/ReportRouteStateModel';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReportService from 'services/ReportService';
import { constants, iOS } from 'utils';
import HatchlingsAndWashbacksByCountyReportGenerator from './HatchlingsAndWashbacksByCountyReport/HatchlingsAndWashbacksByCountyReportGenerator';
import './Report.sass';
import TurtleInjuryReportGenerator from './TurtleInjuryReport/TurtleInjuryReportGenerator';
import TurtleTagReportGenerator from './TurtleTagReport/TurtleTagReportGenerator';

const Report: React.FC = () => {
  const [reportDefinition, setReportDefinition] = useState({} as ReportDefinitionModel);
  const [reportOptions, setReportOptions] = useState<any>();
  const [pdfReportUrl, setPdfReportUrl] = useState<string>();
  const [htmlReportContent, setHtmlReportContent] = useState<JSX.Element>();
  const [showSpinner, setShowSpinner] = useState(false);
  const reportRouteState = useLocation().state as ReportRouteStateModel;

  useMount(() => {
    window.scrollTo(0, 0);
  });

  useMount(() => {
    setReportDefinition(reportRouteState.reportDefinition);
    setReportOptions(reportRouteState.reportOptions);
  });

  useEffect(() => {
    if (!reportDefinition.reportId || !reportOptions) return;
    const generateReport = async (reportOptions: any) => {
      try {
        setShowSpinner(true)
        if (reportDefinition.isPdf) {
          const pdfReport = await ReportService.generatePdfReport(reportDefinition.reportId, reportOptions);
          setPdfReportUrl(pdfReport.url);
        } else {
          let content = <></>;
          switch (reportDefinition.reportId) {
            case 'HatchlingsAndWashbacksByCountyReport':
              content = await HatchlingsAndWashbacksByCountyReportGenerator.generate(reportDefinition, reportOptions);
              break;
            case 'TurtleInjuryReport':
              content = await TurtleInjuryReportGenerator.generate(reportDefinition, reportOptions);
              break;
            case 'TurtleTagReport':
              content = await TurtleTagReportGenerator.generate(reportDefinition, reportOptions);
              break;
            default:
              break;
          }
          setHtmlReportContent(content);
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
  }, [reportOptions, reportDefinition]);

  return (
    <div id='report'>
      <Spinner isActive={showSpinner} />
      <nav className='breadcrumb hidden-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/reports'>Reports</Link></li>
          <li><Link to={`/report-options/${reportDefinition.reportId}`}>Report Options</Link></li>
          <li className='is-active'><a href='/#' aria-current='page'>{reportDefinition.reportName}</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb hidden-when-not-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to={`/report-options/${reportDefinition.reportId}`}>&#10094; Report Options</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>

          {pdfReportUrl ? 
            <>
              <h1 className='title has-text-centered'>{reportDefinition.reportName}</h1>
              <div className='view-report-button-container has-text-centered'>
                <a href={pdfReportUrl} 
                  className='view-report-button is-centered-both' 
                  title={reportDefinition.reportName} 
                  target={iOS ? '_self' : '_blank'} 
                  rel='noopener noreferrer'
                >
                    <span>View Report</span><br /><span>(opens in new tab)</span>
                </a>
              </div>
            </>
          : null}

          {htmlReportContent ?
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
