import useMount from 'hooks/UseMount';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../../contexts/AppContext';
import CodeListTableService, { CodeTableType } from '../../services/CodeTableListService';
import WashbacksEventService from '../../services/WashbacksEventService';
import NameValuePair from '../../types/NameValuePair';
import WashbacksEventModel from '../../types/WashbacksEventModel';
import YesNoCancelDialog from '../Dialogs/YesNoCancelDialog';
import YesNoDialog from '../Dialogs/YesNoDialog';
import CheckboxFormField from '../FormFields/CheckboxFormField';
import DateFormField from '../FormFields/DateFormField';
import FormFieldGroup from '../FormFields/FormFieldGroup';
import FormFieldRow from '../FormFields/FormFieldRow';
import IntegerFormField from '../FormFields/IntegerFormField';
import ListFormField from '../FormFields/ListFormField';
import LeaveThisPagePrompt from '../LeaveThisPagePrompt/LeaveThisPagePrompt';
import './WashbacksEvents.sass';

/* eslint-disable jsx-a11y/anchor-is-valid */

const WashbacksEvents: React.FC = () => {

  // eslint-disable-next-line
  const [appContext, setAppContext] = useAppContext();
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
  const firstEditControlRef = useRef<HTMLInputElement>(null);

  const tableColumns = [
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      style: '{padding-left: 1rem}',
      cell: (row: WashbacksEventModel) => <span className='icon cursor-pointer' onClick={(event) => { onEditWashbacksEventClick(row.washbacksEventId, event) }}><i className='fa fa-pencil'></i></span>,
    },
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      cell: (row: WashbacksEventModel) => <span className='icon cursor-pointer' onClick={(event) => { onDeleteWashbacksEventClick(row.washbacksEventId, row.eventDate ? moment(row.eventDate).format('YYYY-MM-DD') : '', event) }}><i className='fa fa-trash'></i></span>,
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
    // make async server request
    const getWashbacksEvents = async () => {
      const washbacksEvents = await WashbacksEventService.getWashbacksEvents(appContext.organizationId || '');
      setCurrentWashbacksEvents(washbacksEvents);
      // if (currentWashbacksEvent.washbacksEventId) {
      //   reset(currentWashbacksEvent);
      //   setCurrentWashbacksEvent(currentWashbacksEvent);
      //   setIsFormEnabled(true);
      // }
    };
    getWashbacksEvents();
  });

  useEffect(() => {
    if (editingStarted && firstEditControlRef?.current !== null) {
      firstEditControlRef.current.focus();
    }
    setEditingStarted(false);
  }, [editingStarted]);

  const fetchWashbacksEvent = (washbacksEventId: string) => {
    // make async server request
    const getWashbacksEvent = async () => {
      const washbacksEvent = await WashbacksEventService.getWashbacksEvent(washbacksEventId);
      reset(washbacksEvent);
      setCurrentWashbacksEvent(washbacksEvent);
    };
    getWashbacksEvent();
  };

  const deleteWashbacksEvent = (washbacksEventId: string) => {
    // make async server request
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
  };

  const onAddWashbacksEventButtonClick = (eventType: string) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const handleEvent = () => {
      const washbacksEvent = {} as WashbacksEventModel;
      washbacksEvent.washbacksEventId = uuidv4();
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

  const onEditWashbacksEventClick = (washbacksEventId: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const handleEvent = () => {
      fetchWashbacksEvent(washbacksEventId);
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

  const onDeleteWashbacksEventClick = (washbacksEventId: string, turtleName: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const handleEvent = () => {
      deleteWashbacksEvent(washbacksEventId);
      setIsFormEnabled(false);
    };

    setDialogTitleText('Confirm Deletion');
    setDialogBodyText(`Delete turtle '${turtleName}' ?`);
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

  const saveWashbacksEvent = ((modifiedWashbacksEvent: WashbacksEventModel) => {
    if (!formState.dirty) return;

    const patchedWashbacksEvent = { ...currentWashbacksEvent, ...modifiedWashbacksEvent };
    WashbacksEventService.saveWashbacksEvent(patchedWashbacksEvent);
    reset(patchedWashbacksEvent);
    setCurrentWashbacksEvent(patchedWashbacksEvent);
    const index = currentWashbacksEvents.findIndex(x => x.washbacksEventId === patchedWashbacksEvent.washbacksEventId);
    if (~index) {
      currentWashbacksEvents[index] = { ...patchedWashbacksEvent };
    } else {
      currentWashbacksEvents.push(patchedWashbacksEvent);
    }
    setCurrentWashbacksEvents([...currentWashbacksEvents]);
  });

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
          <li className='is-active'><a href='#' aria-current='page'>Washbacks Events</a></li>
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
            defaultSortField='turtleName'
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
