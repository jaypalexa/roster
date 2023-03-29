import { Box, Breadcrumbs, Button, createStyles, Grid, makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import clsx from 'clsx';
import Icon from 'components/Icon';
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
import TurtleInjuryReportGenerator from './TurtleInjuryReport/TurtleInjuryReportGenerator';
import TurtleTagReportGenerator from './TurtleTagReport/TurtleTagReportGenerator';

const Report: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(
      {
        ...sharedStyles(theme),
        htmlReportViewingArea: {
          padding: '1.5rem',
        },
        reportPrintButtonContainer: {
          marginBottom: '1.5rem',
        },
        viewReportButtonContainer: {
          marginTop: '2rem',
          height: '100vh',
        },
      })
  );
  const classes = useStyles();

  const [reportDefinition, setReportDefinition] = useState({} as ReportDefinitionModel);
  const [reportOptions, setReportOptions] = useState<any>();
  const [pdfReportUrl, setPdfReportUrl] = useState<string>();
  const [htmlReportContent, setHtmlReportContent] = useState<JSX.Element>();
  const [showSpinner, setShowSpinner] = useState(true);
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
        setShowSpinner(true);
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
    <Box id='report'>
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

      <Grid container justifyContent='center'>
        <Grid item xs={12} md={8}>

          {pdfReportUrl ? 
            <>
              <Typography variant='h1' align='center' gutterBottom={true}>{reportDefinition.reportName}</Typography>
              <Box className={clsx(classes.viewReportButtonContainer, classes.textAlignCenter)}>
                <Button variant='contained' color='primary' type='button' 
                  href={pdfReportUrl} 
                  target={isIosDevice ? '_self' : '_blank'} 
                  rel='noopener noreferrer'
                  startIcon={<Icon icon='print' />} 
                  className={clsx(classes.fixedWidthMedium, classes.textTransformNone, classes.hoverTextWhite)}
                >
                  View Report
                </Button>
                <Typography variant='body1' align='center'>(opens in new tab)</Typography>
              </Box>
            </>
          : null}

          {htmlReportContent ?
            <>
              <Box className={clsx(classes.reportPrintButtonContainer, classes.textAlignCenter)}>
                <Button variant='contained' color='primary' type='button' 
                  onClick={() => { window.print() }} 
                  startIcon={<Icon icon='print' />} 
                  className={clsx(classes.fixedWidthMedium, classes.textTransformNone)}
                >
                  Print
                </Button>
              </Box>
              <Paper className={clsx(classes.formActionButtonsContainer, classes.htmlReportViewingArea)}>
                {htmlReportContent}
              </Paper>
            </>
          : null}
          
        </Grid>
      </Grid>
    </Box>
  );
};

export default Report;
