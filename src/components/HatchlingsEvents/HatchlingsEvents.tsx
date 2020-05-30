import { Breadcrumbs, Button, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import YesNoCancelDialogMui from 'components/Dialogs/YesNoCancelDialogMui';
import YesNoDialogMui from 'components/Dialogs/YesNoDialogMui';
import DateFormFieldMui from 'components/FormFields/DateFormFieldMui';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import IntegerFormFieldMui from 'components/FormFields/IntegerFormFieldMui';
import ListFormFieldMui from 'components/FormFields/ListFormFieldMui';
import IconMui from 'components/Icon/IconMui';
import LeaveThisPagePrompt from 'components/LeaveThisPagePrompt/LeaveThisPagePrompt';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import MaterialTable from 'material-table';
import HatchlingsEventModel from 'models/HatchlingsEventModel';
import NameValuePair from 'models/NameValuePair';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import CodeListTableService, { CodeTableType } from 'services/CodeTableListService';
import HatchlingsEventService from 'services/HatchlingsEventService';
import ToastService from 'services/ToastService';
import sharedStyles from 'styles/sharedStyles';
import { actionIcons, constants, tableIcons, toNumber } from 'utils';
import { v4 as uuidv4 } from 'uuid';

const HatchlingsEvents: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles({...sharedStyles(theme)})
  );
  const classes = useStyles();

  const methods = useForm<HatchlingsEventModel>({ mode: 'onChange' });
  const { handleSubmit, formState, reset } = methods;
  const [currentHatchlingsEvent, setCurrentHatchlingsEvent] = useState({} as HatchlingsEventModel);
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

  const [tableColumns] = useState([
    {
      title: 'Species',
      field: 'species',
    },
    {
      title: 'Event Type',
      field: 'eventType',
    },
    {
      title: 'Event Date',
      field: 'eventDate',
      render: (rowData: HatchlingsEventModel) => <span>{rowData.eventDate ? moment(rowData.eventDate).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: 'Event Count',
      field: 'eventCount',
      render: (rowData: HatchlingsEventModel) => <span>{rowData.eventType === 'Released' ? toNumber(rowData.beachEventCount) + toNumber(rowData.offshoreEventCount) : rowData.eventCount}</span>,
    },
    {
      title: 'County',
      field: 'eventCounty',
    }
  ]);

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
      setCurrentHatchlingsEvent(hatchlingsEvent);
    } 
    catch (err) {
      console.log(err);
      ToastService.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  };

  const deleteHatchlingsEvent = (hatchlingsEventId: string) => {
    try {
      setShowSpinner(true);
      const deleteHatchlingsEvent = async () => {
        await HatchlingsEventService.deleteHatchlingsEvent(hatchlingsEventId);
        const hatchlingsEvent = {} as HatchlingsEventModel;
        reset(hatchlingsEvent);
        setCurrentHatchlingsEvent(hatchlingsEvent);
        const index = currentHatchlingsEvents.findIndex(x => x.hatchlingsEventId === hatchlingsEventId);
        if (~index) {
          var updatedCurrentHatchlingsEvents = [...currentHatchlingsEvents];
          updatedCurrentHatchlingsEvents.splice(index, 1)
          setCurrentHatchlingsEvents(updatedCurrentHatchlingsEvents);
        }
      };
      deleteHatchlingsEvent();
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
      const hatchlingsEvent = {} as HatchlingsEventModel;
      hatchlingsEvent.hatchlingsEventId = uuidv4().toLowerCase();
      hatchlingsEvent.eventType = eventType;
      reset(hatchlingsEvent);
      setCurrentHatchlingsEvent(hatchlingsEvent);
      setIsFormEnabled(true);
      setEditingStarted(true);
    };

    if (formState.dirty) {
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

    if (formState.dirty) {
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
    await saveHatchlingsEvent(modifiedHatchlingsEvent);
    ToastService.success('Record saved');
  });

  const saveHatchlingsEvent = async (modifiedHatchlingsEvent: HatchlingsEventModel) => {
    if (!formState.dirty) return;

    try {
      setShowSpinner(true);
      const patchedHatchlingsEvent = { ...currentHatchlingsEvent, ...modifiedHatchlingsEvent };
      await HatchlingsEventService.saveHatchlingsEvent(patchedHatchlingsEvent);
      reset(patchedHatchlingsEvent);
      setCurrentHatchlingsEvent(patchedHatchlingsEvent);
      const index = currentHatchlingsEvents.findIndex(x => x.hatchlingsEventId === patchedHatchlingsEvent.hatchlingsEventId);
      if (~index) {
        currentHatchlingsEvents[index] = { ...patchedHatchlingsEvent };
      } else {
        currentHatchlingsEvents.push(patchedHatchlingsEvent);
      }
      setCurrentHatchlingsEvents([...currentHatchlingsEvents]);
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
    reset(currentHatchlingsEvent);
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
    <div id='hatchlingsEvents'>
      <Spinner isActive={showSpinner} />
      <LeaveThisPagePrompt isDirty={formState.dirty} />
      <YesNoDialogMui
        isOpen={showYesNoDialog}
        titleText={dialogTitleText}
        bodyText={dialogBodyText}
        onYesClick={onDialogYes}
        onNoClick={onDialogNo}
      />
      <YesNoCancelDialogMui
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
          <Typography variant='h1' align='center'>Hatchling Events</Typography>

          <Grid container justify='center' className={classes.formAddButtonsContainer}>
            <Grid item className={classes.formAddButtonContainer}>
              <Button className={classes.fixedWidthLarge} variant='contained' color='primary' type='button' 
                onClick={onAddHatchlingsEventButtonClick('Acquired')} 
                startIcon={<IconMui icon='add' />}
              >
                Add Acquired Event
              </Button>
            </Grid>
            <Grid item className={classes.formAddButtonContainer}>
              <Button className={classes.fixedWidthLarge} variant='contained' color='primary' type='button' 
                onClick={onAddHatchlingsEventButtonClick('Died')} 
                startIcon={<IconMui icon='add' />}
              >
                Add Died Event
              </Button>
            </Grid>
            <Grid item className={classes.formAddButtonContainer}>
              <Button className={classes.fixedWidthLarge} variant='contained' color='primary' type='button' 
                onClick={onAddHatchlingsEventButtonClick('Released')} 
                startIcon={<IconMui icon='add' />}
              >
                Add Released Event
              </Button>
            </Grid>
            <Grid item className={classes.formAddButtonContainer}>
              <Button className={classes.fixedWidthLarge} variant='contained' color='primary' type='button' 
                onClick={onAddHatchlingsEventButtonClick('DOA')} 
                startIcon={<IconMui icon='add' />}
              >
                Add DOA Event
              </Button>
            </Grid>
          </Grid>

          <div className={classes.horizontalScroll}>
            <MaterialTable            
              icons={tableIcons}
              columns={tableColumns}
              data={currentHatchlingsEvents}
              options={{filtering: true, showTitle: false}}
              onRowClick={(event, data) => onEditHatchlingsEventClick(data as HatchlingsEventModel)}
              actions={[
                {
                  icon: actionIcons.EditIcon,
                  tooltip: 'Edit',
                  onClick: (event, data) => onEditHatchlingsEventClick(data as HatchlingsEventModel)
                },
                {
                  icon: actionIcons.DeleteIcon,
                  tooltip: 'Delete',
                  onClick: (event, data) => onDeleteHatchlingsEventClick(data as HatchlingsEventModel)
                },
              ]}
            />
          </div>
          <hr />

          <Typography variant='h1' gutterBottom={true} align='center'>
            {currentHatchlingsEvent.eventType ? `Hatchlings ${currentHatchlingsEvent.eventType} Event` : ''} {currentHatchlingsEvent.eventDate ? `on ${moment(currentHatchlingsEvent.eventDate).format('YYYY-MM-DD')}` : ''}
          </Typography>

          <FormContext {...methods} >
            <form onSubmit={onSubmit}>
              <fieldset disabled={!isFormEnabled}>
                <FormFieldRow>
                  {showField('species', currentHatchlingsEvent.eventType) ? <ListFormFieldMui fieldName='species' labelText='Species' listItems={species} validationOptions={{ required: 'Species is required' }} refObject={firstEditControlRef} /> : null}
                  {showField('eventDate', currentHatchlingsEvent.eventType) ? <DateFormFieldMui fieldName='eventDate' labelText='Event date' validationOptions={{ required: 'Event date is required' }} /> : null}
                  {showField('eventCount', currentHatchlingsEvent.eventType) ? <IntegerFormFieldMui fieldName='eventCount' labelText='Event count' /> : null}
                  {showField('beachEventCount', currentHatchlingsEvent.eventType) ? <IntegerFormFieldMui fieldName='beachEventCount' labelText={`${currentHatchlingsEvent.eventType} on beach`} /> : null}
                  {showField('offshoreEventCount', currentHatchlingsEvent.eventType) ? <IntegerFormFieldMui fieldName='offshoreEventCount' labelText={`${currentHatchlingsEvent.eventType} offshore`} /> : null}
                  {showField('eventCounty', currentHatchlingsEvent.eventType) ? <ListFormFieldMui fieldName='eventCounty' labelText='County' listItems={counties} /> : null}
                </FormFieldRow>

                <div className={classes.formActionButtonsContainer}>
                  <Button className={clsx(classes.fixedWidthMedium, classes.saveButton)} variant='contained' type='submit' disabled={!(formState.isValid && formState.dirty)}>
                    Save
                  </Button>
                  <Button className={classes.fixedWidthMedium} variant='contained' color='secondary' type='button' onClick={() => onCancelClick()} disabled={!formState.dirty}>
                    Cancel
                  </Button>
                </div>
              </fieldset>
            </form>
          </FormContext>

        </Grid>
      </Grid>
    </div>
  );
};

export default HatchlingsEvents;
