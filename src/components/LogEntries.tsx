import { Box, Breadcrumbs, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import TextareaFormField from 'components/FormFields/TextareaFormField';
import TextFormField from 'components/FormFields/TextFormField';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import MaterialTable from 'material-table';
import LogEntryModel from 'models/LogEntryModel';
import React, { useRef, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import LogEntryService from 'services/LogEntryService';
import ToastService from 'services/ToastService';
import sharedStyles from 'styles/sharedStyles';
import { actionIcons, constants, tableIcons } from 'utils';

const LogEntries: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(sharedStyles(theme))
  );
  const classes = useStyles();

  const methods = useForm<LogEntryModel>({ mode: 'onChange', defaultValues: new LogEntryModel() });
  const { reset } = methods;
  const [currentLogEntries, setCurrentLogEntries] = useState([] as Array<LogEntryModel>);
  const [currentLogEntry, setCurrentLogEntry] = useState(new LogEntryModel());
  const [showSpinner, setShowSpinner] = useState(false);
  const tableRef = useRef<any>(null);

  const [tableColumns] = useState([
    {
      title: 'Entry Date/Time',
      field: 'entryDateTime',
      defaultSort: 'desc' as 'desc'
    },
    {
      title: 'User Name',
      field: 'userName',
    },
    {
      title: 'Message',
      field: 'message',
    },
  ]);

  /* scroll to top */
  useMount(() => {
    window.scrollTo(0, 0);
  });

  /* fetch table data */
  useMount(() => {
    const getLogEntries = async () => {
      try {
        setShowSpinner(true);
        const logEntries = await LogEntryService.getLogEntries();
        setCurrentLogEntries(logEntries);
      } 
      catch (err) {
        console.log(err);
        ToastService.error(constants.ERROR.GENERIC);
      }
      finally {
        setShowSpinner(false);
      }
    };
    getLogEntries();
  });

  const onViewLogEntryClick = (logEntry: LogEntryModel) => {
    reset(logEntry);
    setCurrentLogEntry(logEntry);
  };

  return (
    <Box id='logEntry'>
      <Spinner isActive={showSpinner} />

      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenMobile}>
        <Link to='/'>Home</Link>
        <Typography color='textPrimary'>Log Entries</Typography>
      </Breadcrumbs>
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenNotMobile}>
        <Link to='/'>&#10094; Home</Link>
      </Breadcrumbs>

      <Grid container justify='center'>
        <Grid item xs={12} md={8}>
          <Typography variant='h1' align='center' gutterBottom={true}>Log Entries</Typography>

          <Box className={classes.dataTableContainer}>
            <MaterialTable tableRef={tableRef}
              icons={tableIcons}
              columns={tableColumns}
              data={[...currentLogEntries]}
              options={{filtering: true, showTitle: false}}
              onRowClick={(event, data) => onViewLogEntryClick(data as LogEntryModel)}
              actions={[
                {
                  icon: actionIcons.ViewIcon,
                  tooltip: 'View',
                  onClick: (event, data) => onViewLogEntryClick(data as LogEntryModel)
                },
              ]}
            />
          </Box>
          <hr />

          <Typography variant='h2' align='center' gutterBottom={true}>
            {currentLogEntry.entryDateTime || 'Log Entry'}
          </Typography>

          <FormContext {...methods} >
            <FormFieldRow>
              <TextFormField fieldName='userName' labelText='User name' readonly={true} />
            </FormFieldRow>
            <FormFieldRow>
              <TextareaFormField fieldName='message' labelText='Message' rows={4} readonly={true} />
            </FormFieldRow>
          </FormContext>
          
        </Grid>
      </Grid>
    </Box>
  );
};

export default LogEntries;
