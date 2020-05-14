import YesNoCancelDialog from 'components/Dialogs/YesNoCancelDialog';
import YesNoDialog from 'components/Dialogs/YesNoDialog';
import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import DateFormField from 'components/FormFields/DateFormField';
import FormFieldGroup from 'components/FormFields/FormFieldGroup';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import IntegerFormField from 'components/FormFields/IntegerFormField';
import ListFormField from 'components/FormFields/ListFormField';
import LeaveThisPagePrompt from 'components/LeaveThisPagePrompt/LeaveThisPagePrompt';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import NameValuePair from 'models/NameValuePair';
import WashbacksEventModel from 'models/WashbacksEventModel';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import CodeListTableService, { CodeTableType } from 'services/CodeTableListService';
import WashbacksEventService from 'services/WashbacksEventService';
import { constants } from 'utils';
import { v4 as uuidv4 } from 'uuid';
import './WashbacksEvents.sass';

const WashbacksEvents: React.FC = () => {

  const methods = useForm<WashbacksEventModel>({ mode: 'onChange' });
  const { handleSubmit, formState, reset } = methods;
  const [currentWashbacksEvent, setCurrentWashbacksEvent] = useState({} as WashbacksEventModel);
  const [currentWashbacksEvents, setCurrentWashbacksEvents] = useState([] as Array<WashbacksEventModel>);
  const [counties, setCounties] = useState([] as Array<NameValuePair>);
  const [species, setSpecies] = useState([] as Array<NameValuePair>);
  const [isFormEnabled, setIsFormEnabled] = useState(false);
  const [showYesNoCancelDialog, setShowYesNoCancelDialog] = useState(false);
  const [showYesNoDialog, setShowYesNoDialog] = useState(false);
  const [dialogTitleText, setDialogTitleText] = useState('');
  const [dialogBodyText, setDialogBodyText] = useState('');
  const [onDialogYes, setOnDialogYes] = useState(() => { });
  const [onDialogNo, setOnDialogNo] = useState(() => { });
  const [onDialogCancel, setOnDialogCancel] = useState(() => { });
  const [editingStarted, setEditingStarted] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const firstEditControlRef = useRef<HTMLInputElement>(null);

  const tableColumns = [
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      style: '{padding-left: 1rem}',
      cell: (row: WashbacksEventModel) => <span className='icon cursor-pointer' onClick={(event) => { onEditWashbacksEventClick(row, event) }}><i className='fa fa-pencil'></i></span>,
    },
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      cell: (row: WashbacksEventModel) => <span className='icon cursor-pointer' onClick={(event) => { onDeleteWashbacksEventClick(row, event) }}><i className='fa fa-trash'></i></span>,
    },
    {
      name: 'Species',
      selector: 'species',
      sortable: true
    },
    {
      name: 'Event Type',
      selector: 'eventType',
      sortable: true
    },
    {
      name: 'Event Date',
      selector: (row: WashbacksEventModel) => row.eventDate ? moment(row.eventDate).format('YYYY-MM-DD') : '',
      sortable: true,
    },
    {
      name: 'Event Count',
      selector: 'eventCount',
      sortable: true,
      hide: 599
    },
    {
      name: 'County',
      selector: 'eventCounty',
      sortable: true,
      hide: 599
    },
    {
      name: 'Under 5cm CLSL?',
      selector: (row: WashbacksEventModel) => row.under5cmClsl ? 'Yes' : '',
      sortable: true,
      hide: 599
    }
  ];

  const tableCustomStyles = {
    headRow: {
      style: {
        paddingRight: '1.1rem'
      }
    }
  };

  useMount(() => {
    window.scrollTo(0, 0)
  });

  useMount(() => {
    setCounties(CodeListTableService.getList(CodeTableType.County, true));
    setSpecies(CodeListTableService.getList(CodeTableType.Species, true));
  });

  useMount(() => {
    const getWashbacksEvents = async () => {
      try {
        setShowSpinner(true);
        const washbacksEvents = await WashbacksEventService.getWashbacksEvents();
        setCurrentWashbacksEvents(washbacksEvents);
      } 
      catch (err) {
        console.log(err);
        toast.error(constants.ERROR.GENERIC);
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
      toast.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  };

  const deleteWashbacksEvent = (washbacksEventId: string) => {
    try {
      setShowSpinner(true);
      const deleteWashbacksEvent = async () => {
        await WashbacksEventService.deleteWashbacksEvent(washbacksEventId);
        const washbacksEvent = {} as WashbacksEventModel;
        reset(washbacksEvent);
        setCurrentWashbacksEvent(washbacksEvent);
        const index = currentWashbacksEvents.findIndex(x => x.washbacksEventId === washbacksEventId);
      if (~index) {
          var updatedCurrentWashbacksEvents = [...currentWashbacksEvents];
          updatedCurrentWashbacksEvents.splice(index, 1)
          setCurrentWashbacksEvents(updatedCurrentWashbacksEvents);
      }
    };
      deleteWashbacksEvent();
    } 
    catch (err) {
      console.log(err);
      toast.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  };

  const onAddWashbacksEventButtonClick = (eventType: string) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const handleEvent = () => {
      const washbacksEvent = {} as WashbacksEventModel;
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

  const onEditWashbacksEventClick = (washbacksEvent: WashbacksEventModel, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
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

  const onDeleteWashbacksEventClick = (washbacksEvent: WashbacksEventModel, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const handleEvent = () => {
      deleteWashbacksEvent(washbacksEvent.washbacksEventId);
      setIsFormEnabled(false);
    };

    setDialogTitleText('Confirm Deletion');
    setDialogBodyText(`Delete event from '${washbacksEvent.eventDate ? moment(washbacksEvent.eventDate).format('YYYY-MM-DD') : ''}' ?`);
    setOnDialogYes(() => async () => {
      handleEvent();
      setShowYesNoDialog(false);
    });
    setOnDialogNo(() => () => {
      setShowYesNoDialog(false);
    });
    setShowYesNoDialog(true);
  };

  const onSubmit = handleSubmit((modifiedWashbacksEvent: WashbacksEventModel) => {
    saveWashbacksEvent(modifiedWashbacksEvent);
    toast.success('Record saved');
  });

  const saveWashbacksEvent = async (modifiedWashbacksEvent: WashbacksEventModel) => {
    if (!formState.dirty) return;

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
      toast.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  };

  const onCancel = () => {
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
  }

  return (
    <div id='washbacksEvents'>
      <Spinner isActive={showSpinner} />
      <LeaveThisPagePrompt isDirty={formState.dirty} />
      <YesNoDialog
        isActive={showYesNoDialog}
        titleText={dialogTitleText}
        bodyText={dialogBodyText}
        onYes={onDialogYes}
        onNo={onDialogNo}
      />
      <YesNoCancelDialog
        isActive={showYesNoCancelDialog}
        titleText={dialogTitleText}
        bodyText={dialogBodyText}
        onYes={onDialogYes}
        onNo={onDialogNo}
        onCancel={onDialogCancel}
      />
      <nav className='breadcrumb shown-when-not-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li className='is-active'><a href='/#' aria-current='page'>Washbacks Events</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb shown-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>&#10094; Home</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered hidden-when-mobile'>Washbacks Events</h1>
          <div className='level add-washbacks-event-buttons-container'>
            <p className='level-item'>
              <button className='button is-link full-width-when-mobile' onClick={onAddWashbacksEventButtonClick('Acquired')}>
                <span className='icon'>
                  <i className='fa fa-plus'></i>
                </span>
                &nbsp;&nbsp;&nbsp;Add Washbacks Acquired Event
              </button>
            </p>
            <p className='level-item'>
              <button className='button is-link full-width-when-mobile' onClick={onAddWashbacksEventButtonClick('Died')}>
                <span className='icon'>
                  <i className='fa fa-plus'></i>
                </span>
                &nbsp;&nbsp;&nbsp;Add Washbacks Died Event
              </button>
            </p>
            <p className='level-item'>
              <button className='button is-link full-width-when-mobile' onClick={onAddWashbacksEventButtonClick('Released')}>
                <span className='icon'>
                  <i className='fa fa-plus'></i>
                </span>
                &nbsp;&nbsp;&nbsp;Add Washbacks Released Event
              </button>
            </p>
            <p className='level-item'>
              <button className='button is-link full-width-when-mobile' onClick={onAddWashbacksEventButtonClick('DOA')}>
                <span className='icon'>
                  <i className='fa fa-plus'></i>
                </span>
                &nbsp;&nbsp;&nbsp;Add Washbacks DOA Event
              </button>
            </p>
          </div>

          <DataTable
            title='Washbacks Events'
            columns={tableColumns}
            data={currentWashbacksEvents}
            keyField='washbacksEventId'
            defaultSortField='eventDate'
            noHeader={true}
            fixedHeader={true}
            fixedHeaderScrollHeight='9rem'
            customStyles={tableCustomStyles}
          />

          <hr />

          <h1 className='title has-text-centered'>{currentWashbacksEvent.eventType ? `Washbacks ${currentWashbacksEvent.eventType} Event` : ''} {currentWashbacksEvent.eventDate ? `on ${moment(currentWashbacksEvent.eventDate).format('YYYY-MM-DD')}` : ''}</h1>

          <FormContext {...methods} >
            <form onSubmit={onSubmit}>
              <fieldset disabled={!isFormEnabled}>
                <FormFieldRow>
                  {showField('species', currentWashbacksEvent.eventType) ? <ListFormField fieldName='species' labelText='Species' listItems={species} validationOptions={{ required: 'Species is required' }} refObject={firstEditControlRef} /> : null}
                  {showField('eventDate', currentWashbacksEvent.eventType) ? <DateFormField fieldName='eventDate' labelText='Event date' validationOptions={{ required: 'Event date is required' }} /> : null}
                  {showField('eventCount', currentWashbacksEvent.eventType) ? <IntegerFormField fieldName='eventCount' labelText='Event count' /> : null}
                  {showField('beachEventCount', currentWashbacksEvent.eventType) ? <IntegerFormField fieldName='beachEventCount' labelText={`${currentWashbacksEvent.eventType} on beach`} /> : null}
                  {showField('offshoreEventCount', currentWashbacksEvent.eventType) ? <IntegerFormField fieldName='offshoreEventCount' labelText={`${currentWashbacksEvent.eventType} offshore`} /> : null}
                  {showField('eventCounty', currentWashbacksEvent.eventType) ? <ListFormField fieldName='eventCounty' labelText='County' listItems={counties} /> : null}
                  {showField('under5cmClsl', currentWashbacksEvent.eventType) ? 
                    <FormFieldGroup fieldClass='checkbox-group checkboxes-1' labelText='Size'>
                      <CheckboxFormField fieldName='under5cmClsl' labelText='Under 5cm CLSL?' />
                    </FormFieldGroup>
                  : null}
                </FormFieldRow>
                <div className='field is-grouped form-action-buttons'>
                  <p className='control'>
                    <input
                      type='submit'
                      className='button is-success is-fixed-width-medium'
                      value='Save'
                      disabled={!(formState.isValid && formState.dirty)}
                    />
                  </p>
                  <p className='control'>
                    <input
                      type='button'
                      className='button is-danger is-fixed-width-medium'
                      value='Cancel'
                      onClick={() => onCancel()}
                      disabled={!formState.dirty}
                    />
                  </p>
                </div>
              </fieldset>
            </form>
          </FormContext>

        </div>
      </div>
    </div>
  );
};

export default WashbacksEvents;
