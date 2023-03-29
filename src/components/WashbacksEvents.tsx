import { Box, Breadcrumbs, Button, Divider, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import YesNoCancelDialog from 'components/Dialogs/YesNoCancelDialog';
import YesNoDialog from 'components/Dialogs/YesNoDialog';
import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import CheckboxGroupFormField from 'components/FormFields/CheckboxGroupFormField';
import DateFormField from 'components/FormFields/DateFormField';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import IntegerFormField from 'components/FormFields/IntegerFormField';
import ListFormField from 'components/FormFields/ListFormField';
import Icon from 'components/Icon';
import LeaveThisPagePrompt from 'components/LeaveThisPagePrompt';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import NameValuePair from 'models/NameValuePair';
import WashbacksEventModel from 'models/WashbacksEventModel';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import CodeListTableService, { CodeTableType } from 'services/CodeTableListService';
import ToastService from 'services/ToastService';
import WashbacksEventService from 'services/WashbacksEventService';
import sharedStyles from 'styles/sharedStyles';
import { clone, constants, toNumber } from 'utils';
import { v4 as uuidv4 } from 'uuid';
import DisplayTable from './DisplayTable';

const WashbacksEvents: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(sharedStyles(theme))
  );
  const classes = useStyles();

  const methods = useForm<WashbacksEventModel>({ mode: 'onChange', defaultValues: new WashbacksEventModel(), shouldUnregister: false });
  const { handleSubmit, formState, reset } = methods;
  const [currentWashbacksEvent, setCurrentWashbacksEvent] = useState(new WashbacksEventModel());
  const [currentWashbacksEvents, setCurrentWashbacksEvents] = useState([] as Array<WashbacksEventModel>);
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
      cell: (row: WashbacksEventModel) => <div>{row.eventType === 'Released' ? toNumber(row.beachEventCount) + toNumber(row.offshoreEventCount) : row.eventCount}</div>,
    },
    {
      name: 'County',
      selector: 'eventCounty',
      sortable: true,
    },
    {
      name: 'Under 5cm CLSL?',
      selector: 'under5cmClsl',
      sortable: true,
      cell: (row: WashbacksEventModel) => <div>{row.under5cmClsl ? 'Yes' : ''}</div>,
    },
  ], []);

  /* scroll to top */
  useMount(() => {
    window.scrollTo(0, 0);
  });

  /* fetch listbox data */
  useMount(() => {
    setCounties(CodeListTableService.getList(CodeTableType.County, true));
    setSpecies(CodeListTableService.getList(CodeTableType.Species, true));
  });

  /* fetch table data */
  useMount(() => {
    const getWashbacksEvents = async () => {
      try {
        setShowSpinner(true);
        const washbacksEvents = await WashbacksEventService.getWashbacksEvents();
        setCurrentWashbacksEvents(washbacksEvents);
      } 
      catch (err) {
        console.log(err);
        ToastService.error(constants.ERROR.GENERIC);
      }
      finally {
        setShowSpinner(false);
      }
    };
    getWashbacksEvents();
  });

  useEffect(() => {
    if (editingStarted && firstEditControlRef?.current !== null) {
      firstEditControlRef.current.focus();
    }
    setEditingStarted(false);
  }, [editingStarted]);

  const fetchWashbacksEvent = async (washbacksEventId: string) => {
    try {
      setShowSpinner(true);
      const washbacksEvent = await WashbacksEventService.getWashbacksEvent(washbacksEventId);
      reset(washbacksEvent);
      setCurrentWashbacksEvent(clone(washbacksEvent));
    } 
    catch (err) {
      console.log(err);
      ToastService.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  };

  const deleteWashbacksEvent = async (washbacksEventId: string) => {
    try {
      setShowSpinner(true);
      await WashbacksEventService.deleteWashbacksEvent(washbacksEventId);
      const washbacksEvent = new WashbacksEventModel();
      reset(washbacksEvent);
      setCurrentWashbacksEvent(clone(washbacksEvent));
      const index = currentWashbacksEvents.findIndex(x => x.washbacksEventId === washbacksEventId);
      if (~index) {
        // remove the deleted item from the data table data source
        var updatedCurrentWashbacksEvents = clone(currentWashbacksEvents);
        updatedCurrentWashbacksEvents.splice(index, 1);
        setCurrentWashbacksEvents(updatedCurrentWashbacksEvents);
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

  const onAddWashbacksEventButtonClick = (eventType: string) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const handleEvent = () => {
      const washbacksEvent = new WashbacksEventModel();
      washbacksEvent.washbacksEventId = uuidv4().toLowerCase();
      washbacksEvent.eventType = eventType;
      reset(washbacksEvent);
      setCurrentWashbacksEvent(clone(washbacksEvent));
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

  const onEditWashbacksEventClick = (washbacksEvent: WashbacksEventModel) => {
    const handleEvent = () => {
      fetchWashbacksEvent(washbacksEvent.washbacksEventId);
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

  const onDeleteWashbacksEventClick = (washbacksEvent: WashbacksEventModel) => {
    const handleEvent = () => {
      deleteWashbacksEvent(washbacksEvent.washbacksEventId);
      setIsFormEnabled(false);
    };

    setDialogTitleText('Confirm Deletion');
    setDialogBodyText(`Delete 'Washbacks ${washbacksEvent.eventType}' event from '${washbacksEvent.eventDate ? moment(washbacksEvent.eventDate).format('YYYY-MM-DD') : ''}'?`);
    setOnDialogYes(() => async () => {
      handleEvent();
      setShowYesNoDialog(false);
    });
    setOnDialogNo(() => () => {
      setShowYesNoDialog(false);
    });
    setShowYesNoDialog(true);
  };

  const onSubmit = handleSubmit(async (modifiedWashbacksEvent: WashbacksEventModel) => {
    if (!formState.isDirty) return;

    await saveWashbacksEvent(modifiedWashbacksEvent);
    ToastService.success('Record saved');
  });

  const saveWashbacksEvent = async (modifiedWashbacksEvent: WashbacksEventModel) => {
    try {
      setShowSpinner(true);
      const patchedWashbacksEvent = { ...currentWashbacksEvent, ...modifiedWashbacksEvent };
      await WashbacksEventService.saveWashbacksEvent(patchedWashbacksEvent);
      reset(patchedWashbacksEvent);
      setCurrentWashbacksEvent(clone(patchedWashbacksEvent));
      const index = currentWashbacksEvents.findIndex(x => x.washbacksEventId === patchedWashbacksEvent.washbacksEventId);
      if (~index) {
        currentWashbacksEvents[index] = clone(patchedWashbacksEvent);
      } else {
        currentWashbacksEvents.push(patchedWashbacksEvent);
      }
      setCurrentWashbacksEvents(clone(currentWashbacksEvents));
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
    reset(clone(currentWashbacksEvent));
  };

  const showField = (fieldName: string, eventType: string) => {
    switch(eventType) { 
      case 'Acquired':  { 
        return ['species', 'eventDate', 'eventCount', 'eventCounty', 'under5cmClsl'].includes(fieldName); 
      } 
      case 'Died': { 
        return ['species', 'eventDate', 'eventCount', 'under5cmClsl'].includes(fieldName); 
      } 
      case 'Released': { 
        return ['species', 'eventDate', 'beachEventCount', 'offshoreEventCount'].includes(fieldName); 
      } 
      case 'DOA': { 
        return ['species', 'eventDate', 'eventCount', 'eventCounty', 'under5cmClsl'].includes(fieldName); 
      } 
      default: { 
        return ['species', 'eventDate', 'eventCount', 'eventCounty', 'under5cmClsl'].includes(fieldName); 
      } 
   } 
  };

  return (
    <Box id='washbacksEvents'>
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
        <Typography color='textPrimary'>Washback Events</Typography>
      </Breadcrumbs>
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenNotMobile}>
        <Link to='/'>&#10094; Home</Link>
      </Breadcrumbs>
      <Grid container justifyContent='center'>
        <Grid item xs={12} md={8}>
          <Typography variant='h1' align='center' gutterBottom={true}>Washbacks Events</Typography>

          <Grid container justifyContent='center' className={classes.formAddButtonsContainer}>
            <Grid item className={classes.formAddButtonContainer}>
              <Button className={classes.fixedWidthLarge} variant='contained' color='primary' type='button' 
                onClick={onAddWashbacksEventButtonClick('Acquired')} 
                startIcon={<Icon icon='add' />}
              >
                Add Acquired Event
              </Button>
            </Grid>
            <Grid item className={classes.formAddButtonContainer}>
              <Button className={classes.fixedWidthLarge} variant='contained' color='primary' type='button' 
                onClick={onAddWashbacksEventButtonClick('Died')} 
                startIcon={<Icon icon='add' />}
              >
                Add Died Event
              </Button>
            </Grid>
            <Grid item className={classes.formAddButtonContainer}>
              <Button className={classes.fixedWidthLarge} variant='contained' color='primary' type='button' 
                onClick={onAddWashbacksEventButtonClick('Released')} 
                startIcon={<Icon icon='add' />}
              >
                Add Released Event
              </Button>
            </Grid>
            <Grid item className={classes.formAddButtonContainer}>
              <Button className={classes.fixedWidthLarge} variant='contained' color='primary' type='button' 
                onClick={onAddWashbacksEventButtonClick('DOA')} 
                startIcon={<Icon icon='add' />}
              >
                Add DOA Event
              </Button>
            </Grid>
          </Grid>

          <DisplayTable
            columns={tableColumns}
            data={currentWashbacksEvents}
            defaultSortField="eventDate"
            defaultSortAsc={false}
            onRowClicked={row => onEditWashbacksEventClick(row as WashbacksEventModel)}
            onDeleteClicked={row => onDeleteWashbacksEventClick(row as WashbacksEventModel)}
          />

          <Divider />

          <Typography variant='h1' align='center' gutterBottom={true}>
            {currentWashbacksEvent.eventType ? `Washbacks ${currentWashbacksEvent.eventType} Event` : ''} {currentWashbacksEvent.eventDate ? `on ${moment(currentWashbacksEvent.eventDate).format('YYYY-MM-DD')}` : ''}
          </Typography>

          <FormProvider {...methods} >
            <form onSubmit={onSubmit}>
              <fieldset disabled={!isFormEnabled}>
                <FormFieldRow>
                  {showField('species', currentWashbacksEvent.eventType) ? <ListFormField fieldName='species' labelText='Species' listItems={species} validationRules={{ required: 'Species is required' }} refObject={firstEditControlRef} disabled={!isFormEnabled} /> : null}
                  {showField('eventDate', currentWashbacksEvent.eventType) ? <DateFormField fieldName='eventDate' labelText='Event date' validationRules={{ required: 'Event date is required' }} disabled={!isFormEnabled} /> : null}
                  {showField('eventCount', currentWashbacksEvent.eventType) ? <IntegerFormField fieldName='eventCount' labelText='Event count' disabled={!isFormEnabled} /> : null}
                  {showField('beachEventCount', currentWashbacksEvent.eventType) ? <IntegerFormField fieldName='beachEventCount' labelText={`${currentWashbacksEvent.eventType} on beach`} disabled={!isFormEnabled} /> : null}
                  {showField('offshoreEventCount', currentWashbacksEvent.eventType) ? <IntegerFormField fieldName='offshoreEventCount' labelText={`${currentWashbacksEvent.eventType} offshore`} disabled={!isFormEnabled} /> : null}
                  {showField('eventCounty', currentWashbacksEvent.eventType) ? <ListFormField fieldName='eventCounty' labelText='County' listItems={counties} disabled={!isFormEnabled} /> : null}
                  {showField('under5cmClsl', currentWashbacksEvent.eventType) ? 
                    <CheckboxGroupFormField labelText='Size'>
                      <CheckboxFormField fieldName='under5cmClsl' labelText='Under 5cm CLSL?' disabled={!isFormEnabled} />
                    </CheckboxGroupFormField>
                  : null}
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

export default WashbacksEvents;
