import { Breadcrumbs, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import ReportDefinitionModel from 'models/ReportDefinitionModel';
import ReportRouteStateModel from 'models/ReportRouteStateModel';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ReportService from 'services/ReportService';
import ToastService from 'services/ToastService';
import sharedStyles from 'styles/sharedStyles';
import { constants, isIosDevice } from 'utils';
import HatchlingsAndWashbacksByCountyReportGenerator from './HatchlingsAndWashbacksByCountyReport/HatchlingsAndWashbacksByCountyReportGenerator';
import './Report.sass';
import TurtleInjuryReportGenerator from './TurtleInjuryReport/TurtleInjuryReportGenerator';
import TurtleTagReportGenerator from './TurtleTagReport/TurtleTagReportGenerator';

const Report: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(
      {
        ...sharedStyles(theme),
        otherReportsHeader: {
          marginTop: '2rem',
        },
      })
  );
  const classes = useStyles();

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
        ToastService.error(constants.ERROR.GENERIC);
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
     
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenMobile}>
        <Link to='/'>Home</Link>
        <Link to='/reports'>Reports</Link>
        <Link to={`/report-options/${reportDefinition.reportId}`}>Report Options</Link>
        <Typography color='textPrimary'>{reportDefinition.reportName}</Typography>
      </Breadcrumbs>
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenNotMobile}>
        <Link to={`/report-options/${reportDefinition.reportId}`}>&#10094; Report Options</Link>
      </Breadcrumbs>

      <Grid container justify='center'>
        <Grid item xs={12} md={8}>

          {pdfReportUrl ? 
            <>
              <h1 className='title has-text-centered'>{reportDefinition.reportName}</h1>
              <div className='view-report-button-container has-text-centered'>
                <a href={pdfReportUrl} 
                  className='view-report-button is-centered-both' 
                  title={reportDefinition.reportName} 
                  target={isIosDevice ? '_self' : '_blank'} 
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
          
        </Grid>
      </Grid>
    </div>
  );
};

export default Report;
