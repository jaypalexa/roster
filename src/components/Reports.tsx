import { Box, Breadcrumbs, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import browserHistory from 'browserHistory';
import ChildNavigation from 'components/ChildNavigation';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import ReportDefinitionModel from 'models/ReportDefinitionModel';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReportService from 'services/ReportService';
import sharedStyles from 'styles/sharedStyles';

const Reports: React.FC = () => {

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

  const [reportDefinitions, setReportDefinitions] = useState([] as Array<ReportDefinitionModel>);
  const [showSpinner, setShowSpinner] = useState(false);

  useMount(() => {
    window.scrollTo(0, 0);
  });

  useMount(() => {
    setShowSpinner(true);
    const definitions = ReportService.getReportList();
    setReportDefinitions(definitions);
    setShowSpinner(false);
  });

  const onChildNavigationClick = (reportDefinition: ReportDefinitionModel) => {
    setTimeout(() => {
      browserHistory.push(`/report-options/${reportDefinition.reportId}`);
    }, 0);
  };

  const renderChildNavigation = (reportDefinition: ReportDefinitionModel) => {
    return <ChildNavigation 
              key={reportDefinition.reportId} 
              itemName={reportDefinition.reportName} 
              onClick={() => onChildNavigationClick(reportDefinition)}
            />
  };

  return (
    <Box id='reports'>
      <Spinner isActive={showSpinner} />

      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenMobile}>
        <Link to='/'>Home</Link>
        <Typography color='textPrimary'>Reports</Typography>
      </Breadcrumbs>
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenNotMobile}>
        <Link to='/'>&#10094; Home</Link>
      </Breadcrumbs>

      <Grid container justify='center'>
        <Grid item xs={12} md={6}>
          <Typography variant='h1' align='center' gutterBottom={true}>FWC Reports</Typography>
          {reportDefinitions
            .filter(item => item.isPdf)
            .map((item) => renderChildNavigation(item))
          }

          <Typography variant='h1' align='center' className={classes.otherReportsHeader}>Other Reports</Typography>
          {reportDefinitions
            .filter(item => !item.isPdf)
            .map((item) => renderChildNavigation(item))
          }
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
