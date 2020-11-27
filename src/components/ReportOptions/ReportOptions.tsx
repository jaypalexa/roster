import { Box, Breadcrumbs, Button, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import browserHistory from 'browserHistory';
import clsx from 'clsx';
import Spinner from 'components/Spinner/Spinner';
import { useAppContext } from 'contexts/AppContext';
import ReportDefinitionModel from 'models/ReportDefinitionModel';
import ReportRouteStateModel from 'models/ReportRouteStateModel';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, RouteComponentProps } from 'react-router-dom';
import AuthenticationService from 'services/AuthenticationService';
import ReportService from 'services/ReportService';
import sharedStyles from 'styles/sharedStyles';
import ReportOptionsFormFields from './ReportOptionsFormFields';

type ReportOptionsParams = { reportId: string };

const ReportOptions: React.FC<RouteComponentProps<ReportOptionsParams>> = ({match}) => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(sharedStyles(theme))
  );
  const classes = useStyles();

  const [appContext, setAppContext] = useAppContext();
  const [reportDefinition, setReportDefinition] = useState({} as ReportDefinitionModel);
  const methods = useForm<any>({ mode: 'onChange', defaultValues: appContext.reportOptions[match.params.reportId], shouldUnregister: false });
  const { handleSubmit } = methods;
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setShowSpinner(true);
    const definition = ReportService.getReportDefinition(match.params.reportId);
    setReportDefinition(definition);
    setShowSpinner(false);
  }, [match.params.reportId]);

  const onSubmit = handleSubmit(async (reportOptions: any) => {
    AuthenticationService.updateUserActivity();
    appContext.reportOptions[reportDefinition.reportId] = reportOptions;
    setAppContext({ ...appContext, reportOptions: appContext.reportOptions });
    setTimeout(() => {
      const reportRouteState = {} as ReportRouteStateModel;
      reportRouteState.reportDefinition = reportDefinition;
      reportRouteState.reportOptions = reportOptions;
      browserHistory.push('/report', reportRouteState);
    }, 0);
  });

  return (
    <Box id='reportOptions'>
      <Spinner isActive={showSpinner} />

      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenMobile}>
        <Link to='/'>Home</Link>
        <Link to='/reports'>Reports</Link>
        <Typography color='textPrimary'>Report Options</Typography>
      </Breadcrumbs>
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenNotMobile}>
        <Link to='/reports'>&#10094; Reports</Link>
      </Breadcrumbs>

      <Grid container justify='center'>
        <Grid item xs={12} md={4}>
          <Typography variant='h1' align='center' gutterBottom={true}>{reportDefinition.reportName} Options</Typography>
          <FormProvider {...methods} >
            <form onSubmit={onSubmit}>
              <ReportOptionsFormFields reportDefinition={reportDefinition} setShowSpinner={setShowSpinner} />
              <Box className={classes.formActionButtonsContainer}>
                <Button className={clsx(classes.fixedWidthMedium, classes.saveButton)} variant='contained' type='submit'>
                  Generate
                </Button>
              </Box>
            </form>
          </FormProvider>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportOptions;
