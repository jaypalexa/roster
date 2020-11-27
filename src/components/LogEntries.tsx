import { Box, Breadcrumbs, Button, Divider, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import copy from 'clipboard-copy';
import clsx from 'clsx';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import TextareaFormField from 'components/FormFields/TextareaFormField';
import TextFormField from 'components/FormFields/TextFormField';
import Spinner from 'components/Spinner/Spinner';
import LogEntryModel from 'models/LogEntryModel';
import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import LogEntryService from 'services/LogEntryService';
import ToastService from 'services/ToastService';
import sharedStyles from 'styles/sharedStyles';
import { constants } from 'utils';
import DisplayTable from './DisplayTable';

const LogEntries: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(sharedStyles(theme))
  );
  const classes = useStyles();

  const methods = useForm<LogEntryModel>({ mode: 'onChange', defaultValues: new LogEntryModel(), shouldUnregister: false });
  const { reset } = methods;
  const [currentLogEntries, setCurrentLogEntries] = useState([] as Array<LogEntryModel>);
  const [currentLogEntry, setCurrentLogEntry] = useState(new LogEntryModel());
  const [isFormEnabled, setIsFormEnabled] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const tableColumns = useMemo(() => [
    {
      name: 'Entry Date/Time',
      selector: 'entryDateTime',
      sortable: true,
      width: '200px',
    },
    {
      name: 'User Name',
      selector: 'userName',
      sortable: true,
      width: '200px',
    },
    {
      name: 'Message',
      selector: 'message',
      sortable: true,
      grow: 2,
    },
  ], []);

  /* scroll to top */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* fetch table data */
  useEffect(() => {
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
  }, []);

  const onViewLogEntryClick = (logEntry: LogEntryModel) => {
    reset(logEntry);
    setCurrentLogEntry(logEntry);
    setIsFormEnabled(true);
  };

  const onCopyToClipboardClick = (logEntry: LogEntryModel) => {
    copy(JSON.stringify(logEntry));
    ToastService.info(constants.COPIED_TO_CLIPBOARD);
  };

  const onCopyCurrentToClipboardClick = () => {
    onCopyToClipboardClick(currentLogEntry);
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

          <DisplayTable
            columns={tableColumns}
            data={currentLogEntries}
            defaultSortField="entryDateTime"
            defaultSortAsc={false}
            onRowClicked={row => onViewLogEntryClick(row as LogEntryModel)}
            readOnly={true}
          />

          <Divider />

          <Typography variant='h2' align='center' gutterBottom={true}>
            {currentLogEntry.entryDateTime ? `Log Entry at ${currentLogEntry.entryDateTime}` : 'Log Entry'}
          </Typography>

          <FormProvider {...methods} >
            <FormFieldRow>
              <TextFormField fieldName='userName' labelText='User name' readonly={true} disabled={!isFormEnabled} />
            </FormFieldRow>
            <FormFieldRow>
              <TextareaFormField fieldName='message' labelText='Message' rows={12} readonly={true} disabled={!isFormEnabled} />
            </FormFieldRow>
            
            <Box className={classes.formActionButtonsContainer}>
              <Button className={clsx(classes.fixedWidthLarge)} 
                color='primary' 
                variant='contained' 
                type='button' 
                disabled={!currentLogEntry.logEntryId}
                onClick={onCopyCurrentToClipboardClick}>
                Copy to clipboard
              </Button>
            </Box>
          </FormProvider>
          
        </Grid>
      </Grid>
    </Box>
  );
};

export default LogEntries;
