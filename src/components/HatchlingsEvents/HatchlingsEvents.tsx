import useMount from 'hooks/UseMount';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import CodeListTableService, { CodeTableType } from '../../services/CodeTableListService';
import HatchlingsEventService from '../../services/HatchlingsEventService';
import HatchlingsEventModel from '../../types/HatchlingsEventModel';
import NameValuePair from '../../types/NameValuePair';
import YesNoCancelDialog from '../Dialogs/YesNoCancelDialog';
import YesNoDialog from '../Dialogs/YesNoDialog';
import DateFormField from '../FormFields/DateFormField';
import FormFieldRow from '../FormFields/FormFieldRow';
import IntegerFormField from '../FormFields/IntegerFormField';
import ListFormField from '../FormFields/ListFormField';
import LeaveThisPagePrompt from '../LeaveThisPagePrompt/LeaveThisPagePrompt';
import './HatchlingsEvents.sass';

/* eslint-disable jsx-a11y/anchor-is-valid */

const HatchlingsEvents: React.FC = () => {

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
      cell: (row: HatchlingsEventModel) => <span className='icon cursor-pointer' onClick={(event) => { onEditHatchlingsEventClick(row.hatchlingsEventId, event) }}><i className='fa fa-pencil'></i></span>,
    },
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      cell: (row: HatchlingsEventModel) => <span className='icon cursor-pointer' onClick={(event) => { onDeleteHatchlingsEventClick(row.hatchlingsEventId, row.eventDate ? moment(row.eventDate).format('YYYY-MM-DD') : '', event) }}><i className='fa fa-trash'></i></span>,
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
      selector: (row: HatchlingsEventModel) => row.eventDate ? moment(row.eventDate).format('YYYY-MM-DD') : '',
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
    const getHatchlingsEvents = async () => {
      const hatchlingsEvents = await HatchlingsEventService.getHatchlingsEvents();
      setCurrentHatchlingsEvents(hatchlingsEvents);
      if (currentHatchlingsEvent.hatchlingsEventId) {
        reset(currentHatchlingsEvent);
        setCurrentHatchlingsEvent(currentHatchlingsEvent);
        setIsFormEnabled(true);
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

  const fetchHatchlingsEvent = (hatchlingsEventId: string) => {
    const getHatchlingsEvent = async () => {
      const hatchlingsEvent = await HatchlingsEventService.getHatchlingsEvent(hatchlingsEventId);
      reset(hatchlingsEvent);
      setCurrentHatchlingsEvent(hatchlingsEvent);
    };
    getHatchlingsEvent();
  };

  const deleteHatchlingsEvent = (hatchlingsEventId: string) => {
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

  const onEditHatchlingsEventClick = (hatchlingsEventId: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const handleEvent = () => {
      fetchHatchlingsEvent(hatchlingsEventId);
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

  const onDeleteHatchlingsEventClick = (hatchlingsEventId: string, turtleName: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const handleEvent = () => {
      deleteHatchlingsEvent(hatchlingsEventId);
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

  const onSubmit = handleSubmit((modifiedHatchlingsEvent: HatchlingsEventModel) => {
    saveHatchlingsEvent(modifiedHatchlingsEvent);
    toast.success('Record saved');
  });

  const saveHatchlingsEvent = ((modifiedHatchlingsEvent: HatchlingsEventModel) => {
    if (!formState.dirty) return;

    const patchedHatchlingsEvent = { ...currentHatchlingsEvent, ...modifiedHatchlingsEvent };
    HatchlingsEventService.saveHatchlingsEvent(patchedHatchlingsEvent);
    reset(patchedHatchlingsEvent);
    setCurrentHatchlingsEvent(patchedHatchlingsEvent);
    const index = currentHatchlingsEvents.findIndex(x => x.hatchlingsEventId === patchedHatchlingsEvent.hatchlingsEventId);
    if (~index) {
      currentHatchlingsEvents[index] = { ...patchedHatchlingsEvent };
    } else {
      currentHatchlingsEvents.push(patchedHatchlingsEvent);
    }
    setCurrentHatchlingsEvents([...currentHatchlingsEvents]);
  });

  const onCancel = () => {
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
  }

  return (
    <div id='hatchlingsEvents'>
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
          <li className='is-active'><a href='#' aria-current='page'>Hatchlings Events</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb shown-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>&#10094; Home</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered hidden-when-mobile'>Hatchlings Events</h1>
          <div className='level add-hatchlings-event-buttons-container'>
            <p className='level-item'>
              <button className='button is-link full-width-when-mobile' onClick={onAddHatchlingsEventButtonClick('Acquired')}>
                <span className='icon'>
                  <i className='fa fa-plus'></i>
                </span>
                &nbsp;&nbsp;&nbsp;Add Hatchlings Acquired Event
              </button>
            </p>
            <p className='level-item'>
              <button className='button is-link full-width-when-mobile' onClick={onAddHatchlingsEventButtonClick('Died')}>
                <span className='icon'>
                  <i className='fa fa-plus'></i>
                </span>
                &nbsp;&nbsp;&nbsp;Add Hatchlings Died Event
              </button>
            </p>
            <p className='level-item'>
              <button className='button is-link full-width-when-mobile' onClick={onAddHatchlingsEventButtonClick('Released')}>
                <span className='icon'>
                  <i className='fa fa-plus'></i>
                </span>
                &nbsp;&nbsp;&nbsp;Add Hatchlings Released Event
              </button>
            </p>
            <p className='level-item'>
              <button className='button is-link full-width-when-mobile' onClick={onAddHatchlingsEventButtonClick('DOA')}>
                <span className='icon'>
                  <i className='fa fa-plus'></i>
                </span>
                &nbsp;&nbsp;&nbsp;Add Hatchlings DOA Event
              </button>
            </p>
          </div>

          <DataTable
            title='Hatchlings Events'
            columns={tableColumns}
            data={currentHatchlingsEvents}
            keyField='hatchlingsEventId'
            defaultSortField='turtleName'
            noHeader={true}
            fixedHeader={true}
            fixedHeaderScrollHeight='9rem'
            customStyles={tableCustomStyles}
          />

          <hr />

          <h1 className='title has-text-centered'>{currentHatchlingsEvent.eventType ? `Hatchlings ${currentHatchlingsEvent.eventType} Event` : ''} {currentHatchlingsEvent.eventDate ? `on ${moment(currentHatchlingsEvent.eventDate).format('YYYY-MM-DD')}` : ''}</h1>

          <FormContext {...methods} >
            <form onSubmit={onSubmit}>
              <fieldset disabled={!isFormEnabled}>
                <FormFieldRow>
                  {showField('species', currentHatchlingsEvent.eventType) ? <ListFormField fieldName='species' labelText='Species' listItems={species} validationOptions={{ required: 'Species is required' }} refObject={firstEditControlRef} /> : null}
                  {showField('eventDate', currentHatchlingsEvent.eventType) ? <DateFormField fieldName='eventDate' labelText='Event date' validationOptions={{ required: 'Event date is required' }} /> : null}
                  {showField('eventCount', currentHatchlingsEvent.eventType) ? <IntegerFormField fieldName='eventCount' labelText='Event count' /> : null}
                  {showField('beachEventCount', currentHatchlingsEvent.eventType) ? <IntegerFormField fieldName='beachEventCount' labelText={`${currentHatchlingsEvent.eventType} on beach`} /> : null}
                  {showField('offshoreEventCount', currentHatchlingsEvent.eventType) ? <IntegerFormField fieldName='offshoreEventCount' labelText={`${currentHatchlingsEvent.eventType} offshore`} /> : null}
                  {showField('eventCounty', currentHatchlingsEvent.eventType) ? <ListFormField fieldName='eventCounty' labelText='County' listItems={counties} /> : null}
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

export default HatchlingsEvents;
