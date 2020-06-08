import { Box, Breadcrumbs, Button, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import YesNoCancelDialog from 'components/Dialogs/YesNoCancelDialog';
import YesNoDialog from 'components/Dialogs/YesNoDialog';
import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import CheckboxGroupFormField from 'components/FormFields/CheckboxGroupFormField';
import DateFormField from 'components/FormFields/DateFormField';
import FormFieldRowMui from 'components/FormFields/FormFieldRow';
import IntegerFormField from 'components/FormFields/IntegerFormField';
import ListFormField from 'components/FormFields/ListFormField';
import Icon from 'components/Icon';
import LeaveThisPagePrompt from 'components/LeaveThisPagePrompt';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import MaterialTable from 'material-table';
import NameValuePair from 'models/NameValuePair';
import WashbacksEventModel from 'models/WashbacksEventModel';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import CodeListTableService, { CodeTableType } from 'services/CodeTableListService';
import ToastService from 'services/ToastService';
import WashbacksEventService from 'services/WashbacksEventService';
import sharedStyles from 'styles/sharedStyles';
import { actionIcons, constants, tableIcons, toNumber } from 'utils';
import { v4 as uuidv4 } from 'uuid';

const WashbacksEvents: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles({...sharedStyles(theme)})
  );
  const classes = useStyles();

  const methods = useForm<WashbacksEventModel>({ mode: 'onChange', defaultValues: new WashbacksEventModel() });
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
  const tableRef = useRef<any>(null);

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
      render: (rowData: WashbacksEventModel) => <span>{rowData.eventDate ? moment(rowData.eventDate).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: 'Event Count',
      field: 'eventCount',
      render: (rowData: WashbacksEventModel) => <div style={{textAlign: 'right'}}><span>{rowData.eventType === 'Released' ? toNumber(rowData.beachEventCount) + toNumber(rowData.offshoreEventCount) : rowData.eventCount}</span></div>,
    },
    {
      title: 'County',
      field: 'eventCounty',
    },
    {
      title: 'Under 5cm CLSL?',
      field: 'under5cmClsl',
      render: (rowData: WashbacksEventModel) => <span>{rowData.under5cmClsl ? 'Yes' : ''}</span>,
    },
  ]);

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
      setCurrentWashbacksEvent(washbacksEvent);
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
      setCurrentWashbacksEvent(washbacksEvent);
      const index = currentWashbacksEvents.findIndex(x => x.washbacksEventId === washbacksEventId);
      if (~index) {
        // if we are deleting the last item on the page, 
        // "go back" one page to account for MaterialTable bug
        const dataManager = tableRef.current.dataManager;
        const numberOfItemsDisplayedInCurrentPage = dataManager.searchedData.length % dataManager.pageSize;
        if (numberOfItemsDisplayedInCurrentPage === 1 && dataManager.currentPage > 0) {
          dataManager.changeCurrentPage(dataManager.currentPage - 1);
        }

        // remove the deleted item from the data table data source
        var updatedCurrentWashbacksEvents = [...currentWashbacksEvents];
        updatedCurrentWashbacksEvents.splice(index, 1)
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
      setCurrentWashbacksEvent(washbacksEvent);
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

  const onEditWashbacksEventClick = (washbacksEvent: WashbacksEventModel) => {
    const handleEvent = () => {
      fetchWashbacksEvent(washbacksEvent.washbacksEventId);
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
    if (!formState.dirty) return;

    await saveWashbacksEvent(modifiedWashbacksEvent);
    ToastService.success('Record saved');
  });

  const saveWashbacksEvent = async (modifiedWashbacksEvent: WashbacksEventModel) => {
    try {
      setShowSpinner(true);
      const patchedWashbacksEvent = { ...currentWashbacksEvent, ...modifiedWashbacksEvent };
      await WashbacksEventService.saveWashbacksEvent(patchedWashbacksEvent);
      reset(patchedWashbacksEvent);
      setCurrentWashbacksEvent(patchedWashbacksEvent);
      const index = currentWashbacksEvents.findIndex(x => x.washbacksEventId === patchedWashbacksEvent.washbacksEventId);
      if (~index) {
        currentWashbacksEvents[index] = { ...patchedWashbacksEvent };
      } else {
        currentWashbacksEvents.push(patchedWashbacksEvent);
      }
      setCurrentWashbacksEvents([...currentWashbacksEvents]);
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
    reset(currentWashbacksEvent);
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
      <LeaveThisPagePrompt isDirty={formState.dirty} />
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
      <Grid container justify='center'>
        <Grid item xs={12} md={8}>
          <Typography variant='h1' align='center'>Washback Events</Typography>

          <Grid container justify='center' className={classes.formAddButtonsContainer}>
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

          <Box className={classes.dataTableContainer}>
            <MaterialTable tableRef={tableRef}
              icons={tableIcons}
              columns={tableColumns}
              data={[...currentWashbacksEvents]}
              options={{filtering: true, showTitle: false}}
              onRowClick={(event, data) => onEditWashbacksEventClick(data as WashbacksEventModel)}
              actions={[
                {
                  icon: actionIcons.EditIcon,
                  tooltip: 'Edit',
                  onClick: (event, data) => onEditWashbacksEventClick(data as WashbacksEventModel)
                },
                {
                  icon: actionIcons.DeleteIcon,
                  tooltip: 'Delete',
                  onClick: (event, data) => onDeleteWashbacksEventClick(data as WashbacksEventModel)
                },
              ]}
            />
          </Box>
          <hr />

          <Typography variant='h1' gutterBottom={true} align='center'>
            {currentWashbacksEvent.eventType ? `Washbacks ${currentWashbacksEvent.eventType} Event` : ''} {currentWashbacksEvent.eventDate ? `on ${moment(currentWashbacksEvent.eventDate).format('YYYY-MM-DD')}` : ''}
          </Typography>

          <FormContext {...methods} >
            <form onSubmit={onSubmit}>
              <fieldset disabled={!isFormEnabled}>
                <FormFieldRowMui>
                  {showField('species', currentWashbacksEvent.eventType) ? <ListFormField fieldName='species' labelText='Species' listItems={species} validationOptions={{ required: 'Species is required' }} refObject={firstEditControlRef} disabled={!isFormEnabled} /> : null}
                  {showField('eventDate', currentWashbacksEvent.eventType) ? <DateFormField fieldName='eventDate' labelText='Event date' validationOptions={{ required: 'Event date is required' }} disabled={!isFormEnabled} /> : null}
                  {showField('eventCount', currentWashbacksEvent.eventType) ? <IntegerFormField fieldName='eventCount' labelText='Event count' disabled={!isFormEnabled} /> : null}
                  {showField('beachEventCount', currentWashbacksEvent.eventType) ? <IntegerFormField fieldName='beachEventCount' labelText={`${currentWashbacksEvent.eventType} on beach`} disabled={!isFormEnabled} /> : null}
                  {showField('offshoreEventCount', currentWashbacksEvent.eventType) ? <IntegerFormField fieldName='offshoreEventCount' labelText={`${currentWashbacksEvent.eventType} offshore`} disabled={!isFormEnabled} /> : null}
                  {showField('eventCounty', currentWashbacksEvent.eventType) ? <ListFormField fieldName='eventCounty' labelText='County' listItems={counties} disabled={!isFormEnabled} /> : null}
                  {showField('under5cmClsl', currentWashbacksEvent.eventType) ? 
                    <CheckboxGroupFormField labelText='Size'>
                      <CheckboxFormField fieldName='under5cmClsl' labelText='Under 5cm CLSL?' disabled={!isFormEnabled} />
                    </CheckboxGroupFormField>
                  : null}
                </FormFieldRowMui>

                <Box className={classes.formActionButtonsContainer}>
                  <Button className={clsx(classes.fixedWidthMedium, classes.saveButton)} variant='contained' type='submit' disabled={!(formState.isValid && formState.dirty)}>
                    Save
                  </Button>
                  <Button className={classes.fixedWidthMedium} variant='contained' color='secondary' type='button' onClick={() => onCancelClick()} disabled={!formState.dirty}>
                    Cancel
                  </Button>
                </Box>
              </fieldset>
            </form>
          </FormContext>

        </Grid>
      </Grid>
    </Box>
  );
};

export default WashbacksEvents;
