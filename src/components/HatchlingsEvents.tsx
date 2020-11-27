import { Box, Breadcrumbs, Button, Divider, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import YesNoCancelDialog from 'components/Dialogs/YesNoCancelDialog';
import YesNoDialog from 'components/Dialogs/YesNoDialog';
import DateFormField from 'components/FormFields/DateFormField';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import IntegerFormField from 'components/FormFields/IntegerFormField';
import ListFormField from 'components/FormFields/ListFormField';
import Icon from 'components/Icon';
import LeaveThisPagePrompt from 'components/LeaveThisPagePrompt';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import HatchlingsEventModel from 'models/HatchlingsEventModel';
import NameValuePair from 'models/NameValuePair';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import CodeListTableService, { CodeTableType } from 'services/CodeTableListService';
import HatchlingsEventService from 'services/HatchlingsEventService';
import ToastService from 'services/ToastService';
import sharedStyles from 'styles/sharedStyles';
import { clone, constants, toNumber } from 'utils';
import { v4 as uuidv4 } from 'uuid';
import DisplayTable from './DisplayTable';

const HatchlingsEvents: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(sharedStyles(theme))
  );
  const classes = useStyles();

  const methods = useForm<HatchlingsEventModel>({ mode: 'onChange', defaultValues: new HatchlingsEventModel(), shouldUnregister: false });
  const { handleSubmit, formState, reset } = methods;
  const [currentHatchlingsEvent, setCurrentHatchlingsEvent] = useState(new HatchlingsEventModel());
  const [currentHatchlingsEvents, setCurrentHatchlingsEvents] = useState([] as Array<HatchlingsEventModel>);
  const [counties, setCounties] = useState([] as Array<NameValuePair>);
  const [species, setSpecies] = useState([] as Array<NameValuePair>);
  const [isFormEnabled, setIsFormEnabled] = useState(false);
  const [showYesNoCancelDialog, setShowYesNoCancelDialog] = useState(false);
  const [showYesNoDialog, setShowYesNoDialog] = useState(false);
  const [dialogTitleText, setDialogTitleText] = useState('');
  const [dialogBodyText, setDialogBodyText] = useState('');
  const [onDialogYes, setOnDialogYes] = useState<((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined>(() => {});
  const [onDialogNo, setOnDialogNo] = useState<((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined>(() => {});
  const [onDialogCancel, setOnDialogCancel] = useState<((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined>(() => {});
  const [editingStarted, setEditingStarted] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const firstEditControlRef = useRef<HTMLInputElement>(null);

  const tableColumns = useMemo(() => [
    {
      name: 'Species',
      selector: 'species',
      sortable: true,
    },
    {
      name: 'Event Type',
      selector: 'eventType',
      sortable: true,
    },
    {
      name: 'Event Date',
      selector: 'eventDate',
      sortable: true,
    },
    {
      name: 'Event Count',
      selector: 'eventCount',
      sortable: true,
      right: true,
      cell: (row: HatchlingsEventModel) => <div>{row.eventType === 'Released' ? toNumber(row.beachEventCount) + toNumber(row.offshoreEventCount) : row.eventCount}</div>,
    },
    {
      name: 'County',
      selector: 'eventCounty',
      sortable: true,
    },
  ], []);

  /* scroll to top */
  useMount(() => {
    window.scrollTo(0, 0);
  });

  useMount(() => {
    setCounties(CodeListTableService.getList(CodeTableType.County, true));
    setSpecies(CodeListTableService.getList(CodeTableType.Species, true));
  });

  useMount(() => {
    const getHatchlingsEvents = async () => {
      try {
        setShowSpinner(true);
        const hatchlingsEvents = await HatchlingsEventService.getHatchlingsEvents();
        setCurrentHatchlingsEvents(hatchlingsEvents);
      } 
      catch (err) {
        console.log(err);
        ToastService.error(constants.ERROR.GENERIC);
      }
      finally {
        setShowSpinner(false);
      }
    };
    getHatchlingsEvents();
  });

  useEffect(() => {
    if (editingStarted && firstEditControlRef?.current !== null) {
      firstEditControlRef.current.focus();
    }
    setEditingStarted(false);
  }, [editingStarted]);

  const fetchHatchlingsEvent = async (hatchlingsEventId: string) => {
    try {
      setShowSpinner(true);
      const hatchlingsEvent = await HatchlingsEventService.getHatchlingsEvent(hatchlingsEventId);
      reset(hatchlingsEvent);
      setCurrentHatchlingsEvent(clone(hatchlingsEvent));
    } 
    catch (err) {
      console.log(err);
      ToastService.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  };

  const deleteHatchlingsEvent = async (hatchlingsEventId: string) => {
    try {
      setShowSpinner(true);
      await HatchlingsEventService.deleteHatchlingsEvent(hatchlingsEventId);
      const hatchlingsEvent = new HatchlingsEventModel();
      reset(hatchlingsEvent);
      setCurrentHatchlingsEvent(clone(hatchlingsEvent));
      const index = currentHatchlingsEvents.findIndex(x => x.hatchlingsEventId === hatchlingsEventId);
      if (~index) {
        // remove the deleted item from the data table data source
        var updatedCurrentHatchlingsEvents = clone(currentHatchlingsEvents);
        updatedCurrentHatchlingsEvents.splice(index, 1);
        setCurrentHatchlingsEvents(updatedCurrentHatchlingsEvents);
      }
    } 
    catch (err) {
      console.log(err);
      ToastService.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  };

  const onAddHatchlingsEventButtonClick = (eventType: string) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const handleEvent = () => {
      const hatchlingsEvent = new HatchlingsEventModel();
      hatchlingsEvent.hatchlingsEventId = uuidv4().toLowerCase();
      hatchlingsEvent.eventType = eventType;
      reset(hatchlingsEvent);
      setCurrentHatchlingsEvent(clone(hatchlingsEvent));
      setIsFormEnabled(true);
      setEditingStarted(true);
    };

    if (formState.isDirty) {
      setDialogTitleText('Unsaved Changes');
      setDialogBodyText('Save changes?');
      setOnDialogYes(() => async () => {
        await onSubmit();
        handleEvent();
        setShowYesNoCancelDialog(false);
      });
      setOnDialogNo(() => () => {
        handleEvent();
        setShowYesNoCancelDialog(false);
      });
      setOnDialogCancel(() => () => {
        setShowYesNoCancelDialog(false);
      });
      setShowYesNoCancelDialog(true);
    } else {
      handleEvent();
    }
  };

  const onEditHatchlingsEventClick = (hatchlingsEvent: HatchlingsEventModel) => {
    const handleEvent = () => {
      fetchHatchlingsEvent(hatchlingsEvent.hatchlingsEventId);
      setIsFormEnabled(true);
    };

    if (formState.isDirty) {
      setDialogTitleText('Unsaved Changes');
      setDialogBodyText('Save changes?');
      setOnDialogYes(() => async () => {
        await onSubmit();
        handleEvent();
        setShowYesNoCancelDialog(false);
      });
      setOnDialogNo(() => () => {
        handleEvent();
        setShowYesNoCancelDialog(false);
      });
      setOnDialogCancel(() => () => {
        setShowYesNoCancelDialog(false);
      });
      setShowYesNoCancelDialog(true);
    } else {
      handleEvent();
    }
  };

  const onDeleteHatchlingsEventClick = (hatchlingsEvent: HatchlingsEventModel) => {
    const handleEvent = () => {
      deleteHatchlingsEvent(hatchlingsEvent.hatchlingsEventId);
      setIsFormEnabled(false);
    };

    setDialogTitleText('Confirm Deletion');
    setDialogBodyText(`Delete 'Hatchlings ${hatchlingsEvent.eventType}' event from '${hatchlingsEvent.eventDate ? moment(hatchlingsEvent.eventDate).format('YYYY-MM-DD') : ''}'?`);
    setOnDialogYes(() => async () => {
      handleEvent();
      setShowYesNoDialog(false);
    });
    setOnDialogNo(() => () => {
      setShowYesNoDialog(false);
    });
    setShowYesNoDialog(true);
  };

  const onSubmit = handleSubmit(async (modifiedHatchlingsEvent: HatchlingsEventModel) => {
    if (!formState.isDirty) return;

    await saveHatchlingsEvent(modifiedHatchlingsEvent);
    ToastService.success('Record saved');
  });

  const saveHatchlingsEvent = async (modifiedHatchlingsEvent: HatchlingsEventModel) => {
    try {
      setShowSpinner(true);
      const patchedHatchlingsEvent = { ...currentHatchlingsEvent, ...modifiedHatchlingsEvent };
      await HatchlingsEventService.saveHatchlingsEvent(patchedHatchlingsEvent);
      reset(patchedHatchlingsEvent);
      setCurrentHatchlingsEvent(clone(patchedHatchlingsEvent));
      const index = currentHatchlingsEvents.findIndex(x => x.hatchlingsEventId === patchedHatchlingsEvent.hatchlingsEventId);
      if (~index) {
        currentHatchlingsEvents[index] = clone(patchedHatchlingsEvent);
      } else {
        currentHatchlingsEvents.push(patchedHatchlingsEvent);
      }
      setCurrentHatchlingsEvents(clone(currentHatchlingsEvents));
    } 
    catch (err) {
      console.log(err);
      ToastService.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  };

  const onCancelClick = () => {
    reset(clone(currentHatchlingsEvent));
  };

  const showField = (fieldName: string, eventType: string) => {
    switch(eventType) { 
      case 'Acquired':  { 
        return ['species', 'eventDate', 'eventCount', 'eventCounty'].includes(fieldName); 
      } 
      case 'Died': { 
        return ['species', 'eventDate', 'eventCount'].includes(fieldName); 
      } 
      case 'Released': { 
        return ['species', 'eventDate', 'beachEventCount', 'offshoreEventCount'].includes(fieldName); 
      } 
      case 'DOA': { 
        return ['species', 'eventDate', 'eventCount', 'eventCounty'].includes(fieldName); 
      } 
      default: { 
        return ['species', 'eventDate', 'eventCount', 'eventCounty'].includes(fieldName); 
      } 
   } 
  };

  return (
    <Box id='hatchlingsEvents'>
      <Spinner isActive={showSpinner} />
      <LeaveThisPagePrompt isDirty={formState.isDirty} />
      <YesNoDialog
        isOpen={showYesNoDialog}
        titleText={dialogTitleText}
        bodyText={dialogBodyText}
        onYesClick={onDialogYes}
        onNoClick={onDialogNo}
      />
      <YesNoCancelDialog
        isOpen={showYesNoCancelDialog}
        titleText={dialogTitleText}
        bodyText={dialogBodyText}
        onYesClick={onDialogYes}
        onNoClick={onDialogNo}
        onCancelClick={onDialogCancel}
      />
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenMobile}>
        <Link to='/'>Home</Link>
        <Typography color='textPrimary'>Hatchling Events</Typography>
      </Breadcrumbs>
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenNotMobile}>
        <Link to='/'>&#10094; Home</Link>
      </Breadcrumbs>
      <Grid container justify='center'>
        <Grid item xs={12} md={8}>
          <Typography variant='h1' align='center' gutterBottom={true}>Hatchling Events</Typography>

          <Grid container justify='center' className={classes.formAddButtonsContainer}>
            <Grid item className={classes.formAddButtonContainer}>
              <Button className={classes.fixedWidthLarge} variant='contained' color='primary' type='button' 
                onClick={onAddHatchlingsEventButtonClick('Acquired')} 
                startIcon={<Icon icon='add' />}
              >
                Add Acquired Event
              </Button>
            </Grid>
            <Grid item className={classes.formAddButtonContainer}>
              <Button className={classes.fixedWidthLarge} variant='contained' color='primary' type='button' 
                onClick={onAddHatchlingsEventButtonClick('Died')} 
                startIcon={<Icon icon='add' />}
              >
                Add Died Event
              </Button>
            </Grid>
            <Grid item className={classes.formAddButtonContainer}>
              <Button className={classes.fixedWidthLarge} variant='contained' color='primary' type='button' 
                onClick={onAddHatchlingsEventButtonClick('Released')} 
                startIcon={<Icon icon='add' />}
              >
                Add Released Event
              </Button>
            </Grid>
            <Grid item className={classes.formAddButtonContainer}>
              <Button className={classes.fixedWidthLarge} variant='contained' color='primary' type='button' 
                onClick={onAddHatchlingsEventButtonClick('DOA')} 
                startIcon={<Icon icon='add' />}
              >
                Add DOA Event
              </Button>
            </Grid>
          </Grid>

          <DisplayTable
            columns={tableColumns}
            data={currentHatchlingsEvents}
            defaultSortField="eventDate"
            defaultSortAsc={false}
            onRowClicked={row => onEditHatchlingsEventClick(row as HatchlingsEventModel)}
            onDeleteClicked={row => onDeleteHatchlingsEventClick(row as HatchlingsEventModel)}
          />

          <Divider />

          <Typography variant='h1' align='center' gutterBottom={true}>
            {currentHatchlingsEvent.eventType ? `Hatchlings ${currentHatchlingsEvent.eventType} Event` : ''} {currentHatchlingsEvent.eventDate ? `on ${moment(currentHatchlingsEvent.eventDate).format('YYYY-MM-DD')}` : ''}
          </Typography>

          <FormProvider {...methods} >
            <form onSubmit={onSubmit}>
              <fieldset disabled={!isFormEnabled}>
                <FormFieldRow>
                  {showField('species', currentHatchlingsEvent.eventType) ? <ListFormField fieldName='species' labelText='Species' listItems={species} validationRules={{ required: 'Species is required' }} refObject={firstEditControlRef} disabled={!isFormEnabled} /> : null}
                  {showField('eventDate', currentHatchlingsEvent.eventType) ? <DateFormField fieldName='eventDate' labelText='Event date' validationRules={{ required: 'Event date is required' }} disabled={!isFormEnabled} /> : null}
                  {showField('eventCount', currentHatchlingsEvent.eventType) ? <IntegerFormField fieldName='eventCount' labelText='Event count' disabled={!isFormEnabled} /> : null}
                  {showField('beachEventCount', currentHatchlingsEvent.eventType) ? <IntegerFormField fieldName='beachEventCount' labelText={`${currentHatchlingsEvent.eventType} on beach`} disabled={!isFormEnabled} /> : null}
                  {showField('offshoreEventCount', currentHatchlingsEvent.eventType) ? <IntegerFormField fieldName='offshoreEventCount' labelText={`${currentHatchlingsEvent.eventType} offshore`} disabled={!isFormEnabled} /> : null}
                  {showField('eventCounty', currentHatchlingsEvent.eventType) ? <ListFormField fieldName='eventCounty' labelText='County' listItems={counties} disabled={!isFormEnabled} /> : null}
                </FormFieldRow>

                <Box className={classes.formActionButtonsContainer}>
                  <Button className={clsx(classes.fixedWidthMedium, classes.saveButton)} variant='contained' type='submit' disabled={!(formState.isValid && formState.isDirty)}>
                    Save
                  </Button>
                  <Button className={classes.fixedWidthMedium} variant='contained' color='secondary' type='button' onClick={() => onCancelClick()} disabled={!formState.isDirty}>
                    Cancel
                  </Button>
                </Box>
              </fieldset>
            </form>
          </FormProvider>

        </Grid>
      </Grid>
    </Box>
  );
};

export default HatchlingsEvents;
