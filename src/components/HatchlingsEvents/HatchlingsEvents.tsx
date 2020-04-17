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
import HatchlingsEventService from '../../services/HatchlingsEventService';
import HatchlingsEventModel from '../../types/HatchlingsEventModel';
import NameValuePair from '../../types/NameValuePair';
import YesNoCancelDialog from '../Dialogs/YesNoCancelDialog';
import YesNoDialog from '../Dialogs/YesNoDialog';
import DateFormField from '../FormFields/DateFormField';
import FormFieldRow from '../FormFields/FormFieldRow';
import ListFormField from '../FormFields/ListFormField';
import TextFormField from '../FormFields/TextFormField';
import LeaveThisPagePrompt from '../LeaveThisPagePrompt/LeaveThisPagePrompt';
import './HatchlingsEvents.sass';

/* eslint-disable jsx-a11y/anchor-is-valid */

const HatchlingsEvents: React.FC = () => {

  // eslint-disable-next-line
  const [appContext, setAppContext] = useAppContext();
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

  // console.log(JSON.stringify(formState));

  const hatchingsEventTableColumns = [
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
      name: 'Event Dat',
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
    // make async server request
    const getHatchlingsEvents = async () => {
      const seaTurtles = await HatchlingsEventService.getHatchlingsEvents(appContext.organizationId || '');
      setCurrentHatchlingsEvents(seaTurtles);
      if (currentHatchlingsEvent.hatchlingsEventId) {
        reset(currentHatchlingsEvent);
        setCurrentHatchlingsEvent(currentHatchlingsEvent);
        setIsFormEnabled(true);
        // setEditingStarted(true);
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
    // make async server request
    const getHatchlingsEvent = async () => {
      const seaTurtle = await HatchlingsEventService.getHatchlingsEvent(hatchlingsEventId);
      reset(seaTurtle);
      setCurrentHatchlingsEvent(seaTurtle);
    };
    getHatchlingsEvent();
  };

  const deleteHatchlingsEvent = (hatchlingsEventId: string) => {
    // make async server request
    const deleteHatchlingsEvent = async () => {
      await HatchlingsEventService.deleteHatchlingsEvent(hatchlingsEventId);
      const seaTurtle = {} as HatchlingsEventModel;
      reset(seaTurtle);
      setCurrentHatchlingsEvent(seaTurtle);
      const index = currentHatchlingsEvents.findIndex(x => x.hatchlingsEventId === hatchlingsEventId);
      if (~index) {
        var updatedCurrentHatchlingsEvents = [...currentHatchlingsEvents];
        updatedCurrentHatchlingsEvents.splice(index, 1)
        setCurrentHatchlingsEvents(updatedCurrentHatchlingsEvents);
      }
    };
    deleteHatchlingsEvent();
  };

  const onAddNewHatchlingsEventButtonClick = (eventType: string) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const handleEvent = () => {
      const seaTurtle = {} as HatchlingsEventModel;
      seaTurtle.hatchlingsEventId = uuidv4();
      reset(seaTurtle);
      setCurrentHatchlingsEvent(seaTurtle);
      setIsFormEnabled(true);
      setEditingStarted(true);
    };

    console.log('eventType', eventType);

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
      // setEditingStarted(true);
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

    console.log('In saveHatchlingsEvent()', JSON.stringify(modifiedHatchlingsEvent));
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

  return (
    <div id='seaTurtle'>
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
          <div className='level'>
            <p className='level-item'>
              <button className='button is-link full-width-when-mobile' onClick={onAddNewHatchlingsEventButtonClick('Acquired')}>
                <span className='icon'>
                  <i className='fa fa-plus'></i>
                </span>
                &nbsp;&nbsp;&nbsp;Add New Hatchlings Acquired Event
              </button>
            </p>
            <p className='level-item'>
              <button className='button is-link full-width-when-mobile' onClick={onAddNewHatchlingsEventButtonClick('Died')}>
                <span className='icon'>
                  <i className='fa fa-plus'></i>
                </span>
                &nbsp;&nbsp;&nbsp;Add New Hatchlings Died Event
              </button>
            </p>
            <p className='level-item'>
              <button className='button is-link full-width-when-mobile' onClick={onAddNewHatchlingsEventButtonClick('Released')}>
                <span className='icon'>
                  <i className='fa fa-plus'></i>
                </span>
                &nbsp;&nbsp;&nbsp;Add New Hatchlings Released Event
              </button>
            </p>
            <p className='level-item'>
              <button className='button is-link full-width-when-mobile' onClick={onAddNewHatchlingsEventButtonClick('DOA')}>
                <span className='icon'>
                  <i className='fa fa-plus'></i>
                </span>
                &nbsp;&nbsp;&nbsp;Add New Hatchlings DOA Event
              </button>
            </p>
          </div>

          <DataTable
            title='Hatchlings Events'
            columns={hatchingsEventTableColumns}
            data={currentHatchlingsEvents}
            keyField='hatchlingsEventId'
            defaultSortField='turtleName'
            noHeader={true}
            fixedHeader={true}
            fixedHeaderScrollHeight='9rem'
            customStyles={tableCustomStyles}
          />

          <hr />

          <h1 className='title has-text-centered'>{currentHatchlingsEvent.eventType} {currentHatchlingsEvent.eventDate ? `on ${moment(currentHatchlingsEvent.eventDate).format('YYYY-MM-DD')}` : ''}</h1>

          <FormContext {...methods} >
            <form onSubmit={onSubmit}>
              <fieldset disabled={!isFormEnabled}>
                <FormFieldRow>
                  <ListFormField fieldName='species' labelText='Species' listItems={species} validationOptions={{ required: 'Species is required' }} refObject={firstEditControlRef} />
                  <DateFormField fieldName='eventDate' labelText='Event date' validationOptions={{ required: 'Event date is required' }} />
                  <TextFormField fieldName='eventCount' labelText='Event count' />
                  <TextFormField fieldName='beachEventCount' labelText={`${currentHatchlingsEvent.eventType} on beach`} />
                  <TextFormField fieldName='offshoreEventCount' labelText={`${currentHatchlingsEvent.eventType} offshore`} />
                  <ListFormField fieldName='eventCounty' labelText='County' listItems={counties} />
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
