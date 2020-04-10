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
import SeaTurtleService from '../../services/SeaTurtleService';
import NameValuePair from '../../types/NameValuePair';
import SeaTurtleModel from '../../types/SeaTurtleModel';
import YesNoCancelDialog from '../Dialogs/YesNoCancelDialog';
import YesNoDialog from '../Dialogs/YesNoDialog';
import CheckboxFormField from '../FormFields/CheckboxFormField';
import DateFormField from '../FormFields/DateFormField';
import FormFieldGroup from '../FormFields/FormFieldGroup';
import FormFieldRow from '../FormFields/FormFieldRow';
import ListFormField from '../FormFields/ListFormField';
import TextareaFormField from '../FormFields/TextareaFormField';
import TextFormField from '../FormFields/TextFormField';
import LeaveThisPagePrompt from '../LeaveThisPagePrompt/LeaveThisPagePrompt';
import './SeaTurtles.sass';

/* eslint-disable jsx-a11y/anchor-is-valid */

const SeaTurtles: React.FC = () => {

  // eslint-disable-next-line
  const [appContext, setAppContext] = useAppContext();
  const methods = useForm<SeaTurtleModel>({ mode: 'onChange' });
  const { handleSubmit, formState, reset } = methods;
  const [currentSeaTurtles, setCurrentSeaTurtles] = useState([] as Array<SeaTurtleModel>);
  const [captureProjectTypes, setCaptureProjectTypes] = useState([] as Array<NameValuePair>);
  const [counties, setCounties] = useState([] as Array<NameValuePair>);
  const [species, setSpecies] = useState([] as Array<NameValuePair>);
  const [recaptureTypes, setRecaptureTypes] = useState([] as Array<NameValuePair>);
  const [turtleSizes, setTurtleSizes] = useState([] as Array<NameValuePair>);
  const [turtleStatuses, setTurtleStatuses] = useState([] as Array<NameValuePair>);
  const [yesNoUndetermineds, setYesNoUndetermineds] = useState([] as Array<NameValuePair>);
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
  // console.log(JSON.stringify(methods.errors));

  const seaTurtleTableColumns = [
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      style: '{padding-left: 1rem}',
      cell: (row: SeaTurtleModel) => <span className='icon cursor-pointer' onClick={(event) => {onEditSeaTurtleClick(row.turtleId, event)}}><i className='fa fa-pencil'></i></span>,
    },
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      cell: (row: SeaTurtleModel) => <span className='icon cursor-pointer' onClick={(event) => {onDeleteSeaTurtleClick(row.turtleId, row.turtleName, event)}}><i className='fa fa-trash'></i></span>,
    },
    {
    name: 'Name',
    selector: 'turtleName',
    sortable: true
    },
    {
      name: 'SID #',
      selector: 'sidNumber',
      sortable: true
    },
    {
      name: 'Species',
      selector: 'species',
      sortable: true,
      hide: 599
    },
    {
      name: 'Date Acquired',
      selector: (row: SeaTurtleModel) => row.dateAcquired ? moment(row.dateAcquired).format('YYYY-MM-DD') : '',
      sortable: true,
      hide: 599
    },
    {
      name: 'County',
      selector: 'acquiredCounty',
      sortable: true,
      hide: 599
    },
    {
      name: 'Size',
      selector: 'turtleSize',
      sortable: true,
      hide: 599
    },
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      hide: 599
    },
    {
      name: 'Date Relinquished',
      selector: (row: SeaTurtleModel) => row.dateRelinquished ? moment(row.dateRelinquished).format('YYYY-MM-DD') : '',
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

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  useEffect(() => {
    setCaptureProjectTypes(CodeListTableService.getList(CodeTableType.CaptureProjectType, true));
    setCounties(CodeListTableService.getList(CodeTableType.County, true));
    setRecaptureTypes(CodeListTableService.getList(CodeTableType.RecaptureType, true));
    setSpecies(CodeListTableService.getList(CodeTableType.Species, true));
    setTurtleSizes(CodeListTableService.getList(CodeTableType.TurtleSize, true));
    setTurtleStatuses(CodeListTableService.getList(CodeTableType.TurtleStatus, true));
    setYesNoUndetermineds(CodeListTableService.getList(CodeTableType.YesNoUndetermined, true));
  }, [reset]);

  useMount(() => {
    // make async server request
    const getSeaTurtles = async () => {
      const seaTurtles = await SeaTurtleService.getSeaTurtles(appContext.organizationId || '');
      setCurrentSeaTurtles(seaTurtles);
      if (appContext.seaTurtle?.turtleId) {
        reset(appContext.seaTurtle);
        setCurrentSeaTurtle(appContext.seaTurtle);
        setIsFormEnabled(true);
        setEditingStarted(true);
      }
    };
    getSeaTurtles();
  });

  useEffect(() => {
    if (editingStarted && firstEditControlRef?.current !== null) {
      firstEditControlRef.current.focus();
    }
    setEditingStarted(false);
  }, [editingStarted]);

  const setCurrentSeaTurtle = (seaTurtle: SeaTurtleModel) => {
    setAppContext({ ...appContext, seaTurtle: seaTurtle });
  }

  const fetchSeaTurtle = (turtleId: string) => {
    // make async server request
    const getSeaTurtle = async () => {
      const seaTurtle = await SeaTurtleService.getSeaTurtle(turtleId);
      reset(seaTurtle);
      setCurrentSeaTurtle(seaTurtle);
      // if (firstEditControlRef?.current !== null) {
      //   firstEditControlRef.current.select();
      // }
    };
    getSeaTurtle();
  };

  const deleteSeaTurtle = (turtleId: string) => {
    // make async server request
    const deleteSeaTurtle = async () => {
      await SeaTurtleService.deleteSeaTurtle(turtleId);
      const seaTurtle = {} as SeaTurtleModel;
      reset(seaTurtle);
      setCurrentSeaTurtle(seaTurtle);
      const index = currentSeaTurtles.findIndex(x => x.turtleId === turtleId);
      if (~index) {
        var updatedCurrentSeaTurtles = [...currentSeaTurtles];
        updatedCurrentSeaTurtles.splice(index, 1)
        setCurrentSeaTurtles(updatedCurrentSeaTurtles);
      }
    };
    deleteSeaTurtle();
  };

  const onAddNewSeaTurtleButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const handleEvent = () => {
      const seaTurtle = {} as SeaTurtleModel;
      seaTurtle.turtleId = uuidv4();
      reset(seaTurtle);
      setCurrentSeaTurtle(seaTurtle);
      setIsFormEnabled(true);
      setEditingStarted(true);
    };

    if (formState.dirty) {
      setDialogTitleText('Unsaved Changes');
      setDialogBodyText('Save changes?');
      setOnDialogYes(() => async () => {
        await onSubmitSeaTurtle();
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

  const onEditSeaTurtleClick = (turtleId: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const handleEvent = () => {
      fetchSeaTurtle(turtleId);
      setIsFormEnabled(true);
      setEditingStarted(true);
    };

    if (formState.dirty) {
      setDialogTitleText('Unsaved Changes');
      setDialogBodyText('Save changes?');
      setOnDialogYes(() => async () => {
        await onSubmitSeaTurtle();
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

  const onDeleteSeaTurtleClick = (turtleId: string, turtleName: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const handleEvent = () => {
      deleteSeaTurtle(turtleId);
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

  const onSubmitSeaTurtle = handleSubmit((modifiedSeaTurtle: SeaTurtleModel) => {
    console.log('In onSubmit()', JSON.stringify(modifiedSeaTurtle));
    const patchedSeaTurtle = { ...appContext.seaTurtle, ...modifiedSeaTurtle };
    SeaTurtleService.saveSeaTurtle(patchedSeaTurtle);
    reset(patchedSeaTurtle);
    setCurrentSeaTurtle(patchedSeaTurtle);
    const index = currentSeaTurtles.findIndex(x => x.turtleId === patchedSeaTurtle.turtleId);
    if (~index) {
      currentSeaTurtles[index] = { ...patchedSeaTurtle };
    } else {
      currentSeaTurtles.push(patchedSeaTurtle);
    }
    setCurrentSeaTurtles([...currentSeaTurtles]);

    toast.success('Record saved');
  });

  const onCancelSeaTurtle = () => {
    reset(appContext.seaTurtle);
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
          <li className='is-active'><a href='#' aria-current='page'>Sea Turtles</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb shown-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>&lt; Home</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered hidden-when-mobile'>Sea Turtles</h1>
          <div className='level'>
            <div className='level-left'></div>
            <div className='level-right'>
              <p className='level-item'>
                <button className='button is-link' onClick={onAddNewSeaTurtleButtonClick}>
                  <span className='icon'>
                    <i className='fa fa-plus'></i>
                  </span>
                  &nbsp;&nbsp;&nbsp;Add New Sea Turtle
                </button>
              </p>
            </div>
          </div>

          <DataTable
            title='Sea Turtles'
            columns={seaTurtleTableColumns}
            data={currentSeaTurtles}
            keyField='turtleId'
            defaultSortField='turtleName'
            noHeader={true}
            fixedHeader={true}
            fixedHeaderScrollHeight='9rem'
            customStyles={tableCustomStyles}
          />

          <hr />

          <h1 className='title has-text-centered'>{appContext.seaTurtle?.turtleName}</h1>

          <FormContext {...methods} >
            <form onSubmit={onSubmitSeaTurtle}>
              <fieldset disabled={!isFormEnabled}>
                <h2 className='subtitle'>General Information</h2>
                  <FormFieldRow>
                    <TextFormField fieldName='turtleName' labelText='Name' validationOptions={{ required: 'Name is required' }} refObject={firstEditControlRef} />
                    <TextFormField fieldName='sidNumber' labelText='SID number' />
                    <TextFormField fieldName='strandingIdNumber' labelText='Stranding ID number' />
                  </FormFieldRow>
                  <FormFieldRow>
                    <ListFormField fieldName='species' labelText='Species' listItems={species} />
                    <ListFormField fieldName='turtleSize' labelText='Size' listItems={turtleSizes} />
                    <ListFormField fieldName='status' labelText='Status' listItems={turtleStatuses} />
                  </FormFieldRow>
                  <FormFieldRow>
                    <DateFormField fieldName='dateAcquired' labelText='Date acquired' />
                    <TextFormField fieldName='acquiredFrom' labelText='Acquired from' />
                    <ListFormField fieldName='acquiredCounty' labelText='County' listItems={counties} />
                    <TextFormField fieldName='acquiredLatitude' labelText='Latitude' />
                    <TextFormField fieldName='acquiredLongitude' labelText='Longitude' />
                  </FormFieldRow>
                  <FormFieldRow>
                    <DateFormField fieldName='dateRelinquished' labelText='Date relinquished' />
                    <TextFormField fieldName='relinquishedFrom' labelText='Relinquished from' />
                    <ListFormField fieldName='relinquishedCounty' labelText='County' listItems={counties} />
                    <TextFormField fieldName='relinquishedLatitude' labelText='Latitude' />
                    <TextFormField fieldName='relinquishedLongitude' labelText='Longitude' />
                  </FormFieldRow>
                  <FormFieldRow>
                    <TextareaFormField fieldName='anomalies' labelText='Anomalies' />
                    <FormFieldGroup fieldClass='checkbox-group checkboxes-4' labelText='Injuries'>
                      <CheckboxFormField fieldName='injuryBoatStrike' labelText='Boat/Propeller strike' />
                      <CheckboxFormField fieldName='injuryIntestinalImpaction' labelText='Intestinal impaction' />
                      <CheckboxFormField fieldName='injuryLineEntanglement' labelText='Line/net entanglement' />
                      <CheckboxFormField fieldName='injuryFishHook' labelText='Fish hook' />
                      <CheckboxFormField fieldName='injuryUpperRespiratory' labelText='Upper respiratory' />
                      <CheckboxFormField fieldName='injuryAnimalBite' labelText='Animal bite' />
                      <CheckboxFormField fieldName='injuryFibropapilloma' labelText='Fibropapilloma' />
                      <CheckboxFormField fieldName='injuryMiscEpidemic' labelText='Misc. epidemic' />
                      <CheckboxFormField fieldName='injuryDoa' labelText='DOA' />
                      <CheckboxFormField fieldName='injuryOther' labelText='Other' />
                    </FormFieldGroup>
                  </FormFieldRow>
                <hr />

                <h2 className='subtitle'>Initial Encounter Information</h2>
                  <FormFieldRow>
                    <FormFieldGroup fieldClass='checkbox-group checkboxes-1' labelText='Initial encounter'>
                      <CheckboxFormField fieldName='wasCarryingTagsWhenEnc' labelText='Was turtle carrying tags when initially encountered?' />
                    </FormFieldGroup>
                    <ListFormField fieldName='recaptureType' labelText='If yes, recapture type' listItems={recaptureTypes} />
                    <TextFormField fieldName='tagReturnAddress' labelText='Tag return address' />
                  </FormFieldRow>
                  <FormFieldRow>
                    <ListFormField fieldName='captureProjectType' labelText='Project type' listItems={captureProjectTypes} />
                    <ListFormField fieldName='didTurtleNest' labelText='If "Nesting Beach," did turtle nest?' listItems={yesNoUndetermineds} />
                    <TextFormField fieldName='captureProjectOther' labelText='If "Other," describe' />
                  </FormFieldRow>
                <hr />

                <h2 className={'subtitle ' + (isFormEnabled ? '' : 'is-disabled')}>
                  <Link to={`/sea-turtle-tags`}>Tags ></Link>
                </h2>
                <hr />

                <h2 className={'subtitle ' + (isFormEnabled ? '' : 'is-disabled')}>
                  <Link to={`/sea-turtle-morphometrics`}>Morphometrics ></Link>
                </h2>
                <hr />

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
                      onClick={() => onCancelSeaTurtle()}
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

export default SeaTurtles;
