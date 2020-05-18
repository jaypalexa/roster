import YesNoCancelDialog from 'components/Dialogs/YesNoCancelDialog';
import YesNoDialog from 'components/Dialogs/YesNoDialog';
import DateFormField from 'components/FormFields/DateFormField';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import IntegerFormField from 'components/FormFields/IntegerFormField';
import ListFormField from 'components/FormFields/ListFormField';
import LeaveThisPagePrompt from 'components/LeaveThisPagePrompt/LeaveThisPagePrompt';
import Spinner from 'components/Spinner/Spinner';
import useMount from 'hooks/UseMount';
import HatchlingsEventModel from 'models/HatchlingsEventModel';
import NameValuePair from 'models/NameValuePair';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import CodeListTableService, { CodeTableType } from 'services/CodeTableListService';
import HatchlingsEventService from 'services/HatchlingsEventService';
import { constants } from 'utils';
import { v4 as uuidv4 } from 'uuid';
import './HatchlingsEvents.sass';

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
  const [onDialogYes, setOnDialogYes] = useState<((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined>(() => {});
  const [onDialogNo, setOnDialogNo] = useState<((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined>(() => {});
  const [onDialogCancel, setOnDialogCancel] = useState<((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined>(() => {});
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
      cell: (row: HatchlingsEventModel) => <span className='icon cursor-pointer' onClick={(event) => { onEditHatchlingsEventClick(row, event) }}><i className='fa fa-pencil fa-lg' title='Edit'></i></span>,
    },
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      cell: (row: HatchlingsEventModel) => <span className='icon cursor-pointer' onClick={(event) => { onDeleteHatchlingsEventClick(row, event) }}><i className='fa fa-trash fa-lg' title='Delete'></i></span>,
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
      cell: (row: HatchlingsEventModel) => <span>{row.eventType === 'Released' ? row.beachEventCount + row.offshoreEventCount : row.eventCount}</span>,
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
      try {
        setShowSpinner(true);
        const hatchlingsEvents = await HatchlingsEventService.getHatchlingsEvents();
        setCurrentHatchlingsEvents(hatchlingsEvents);
      } 
      catch (err) {
        console.log(err);
        toast.error(constants.ERROR.GENERIC);
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
      toast.error(constants.ERROR.GENERIC);
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
      toast.error(constants.ERROR.GENERIC);
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

  const onEditHatchlingsEventClick = (hatchlingsEvent: HatchlingsEventModel, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
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

  const onDeleteHatchlingsEventClick = (hatchlingsEvent: HatchlingsEventModel, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
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

  const onSubmit = handleSubmit((modifiedHatchlingsEvent: HatchlingsEventModel) => {
    saveHatchlingsEvent(modifiedHatchlingsEvent);
    toast.success('Record saved');
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
      toast.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  };

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
          <li className='is-active'><a href='/#' aria-current='page'>Hatchlings Events</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb shown-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>&#10094; Home</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>Hatchlings Events</h1>
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
            defaultSortField='eventDate'
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
