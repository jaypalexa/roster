import { Box, Breadcrumbs, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import ChildNavigation from 'components/ChildNavigation';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import ReportDefinitionModel from 'models/ReportDefinitionModel';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthenticationService from 'services/AuthenticationService';
import ReportService from 'services/ReportService';
import sharedStyles from 'styles/sharedStyles';

const BlankForms: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(sharedStyles(theme))
  );
  const classes = useStyles();

  const [reportDefinitions, setReportDefinitions] = useState([] as Array<ReportDefinitionModel>);
  const [showSpinner, setShowSpinner] = useState(false);

  /* scroll to top */
  useMount(() => {
    window.scrollTo(0, 0);
  });

  /* load blank form definitions */
  useMount(() => {
    setShowSpinner(true);
    const definitions = ReportService.getBlankFormList();
    setReportDefinitions(definitions);
    setShowSpinner(false);
  });

  const onChildNavigationClick = (reportDefinition: ReportDefinitionModel) => {
    AuthenticationService.updateUserActivity();
    const url = `https://www.turtlegeek.com/pdf/roster/${reportDefinition.blankFileName}`;
    window.open(url);
  };

  const renderChildNavigation = (reportDefinition: ReportDefinitionModel) => {
    return <ChildNavigation 
              key={reportDefinition.reportId} 
              itemName={reportDefinition.reportName} 
              onClick={() => onChildNavigationClick(reportDefinition)}
            />
  };

  return (
    <Box id='blankForms'>
      <Spinner isActive={showSpinner} />
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenMobile}>
        <Link to='/'>Home</Link>
        <Typography color='textPrimary'>Blank Forms</Typography>
      </Breadcrumbs>
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenNotMobile}>
        <Link to='/'>&#10094; Home</Link>
      </Breadcrumbs>

      <Grid container justifyContent='center'>
        <Grid item xs={12} md={6}>
          <Typography variant='h1' align='center' gutterBottom={true}>Blank Forms</Typography>
          <Typography variant='h2' align='center' gutterBottom={true}>(opens in new tab)</Typography>
          <Box>
            {reportDefinitions
              .map((item) => renderChildNavigation(item))
            }
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BlankForms;
