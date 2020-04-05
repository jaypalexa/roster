import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FormContext, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../../contexts/AppContext';
import TabHelper from '../../helpers/TabHelper';
import CodeListTableService, { CodeTableType } from '../../services/CodeTableListService';
import SeaTurtleService from '../../services/SeaTurtleService';
import NameValuePair from '../../types/NameValuePair';
import SeaTurtleModel from '../../types/SeaTurtleModel';
import SeaTurtleTagModel from '../../types/SeaTurtleTagModel';
import YesNoCancelDialog from '../Dialogs/YesNoCancelDialog';
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
  const seaTurtleMethods = useForm<SeaTurtleModel>({ mode: 'onChange' });
  const { handleSubmit: handleSubmitSeaTurtle, formState: formStateSeaTurtle, reset: resetSeaTurtle } = seaTurtleMethods;
  const [currentSeaTurtle, setCurrentSeaTurtle] = useState({} as SeaTurtleModel);
  const [currentSeaTurtles, setCurrentSeaTurtles] = useState([] as Array<SeaTurtleModel>);
  const [species, setSpecies] = useState([] as Array<NameValuePair>);
  const [turtleSizes, setTurtleSizes] = useState([] as Array<NameValuePair>);
  const [turtleStatuses, setTurtleStatuses] = useState([] as Array<NameValuePair>);
  const [counties, setCounties] = useState([] as Array<NameValuePair>);
  const [isFormEnabled, setIsFormEnabled] = useState(false);
  const [showSaveChangesDialog, setShowSaveChangesDialog] = useState(false);
  const [saveChangesDialogTitleText, setSaveChangesDialogTitleText] = useState('');
  const [saveChangesDialogBodyText, setSaveChangesDialogBodyText] = useState('');
  const [onSaveChangesYes, setOnSaveChangesYes] = useState(() => { });
  const [onSaveChangesNo, setOnSaveChangesNo] = useState(() => { });
  const [onSaveChangesCancel, setOnSaveChangesCancel] = useState(() => { });
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

  const seaTurtleTagTableColumns = [
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      style: '{padding-left: 1rem}',
      cell: (row: SeaTurtleTagModel) => <span className='icon cursor-pointer' onClick={(event) => {onEditSeaTurtleTagClick(row.turtleTagId, event)}}><i className='fa fa-pencil'></i></span>,
    },
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      cell: (row: SeaTurtleTagModel) => <span className='icon cursor-pointer' onClick={(event) => {onDeleteSeaTurtleTagClick(row.turtleTagId, row.tagNumber, event)}}><i className='fa fa-trash'></i></span>,
    },
    {
      name: 'Tag Number',
      selector: 'tagNumber',
      sortable: true
    },
    {
      name: 'Tag Type',
      selector: 'tagType',
      sortable: true
    },
    {
      name: 'Location',
      selector: 'location',
      sortable: true,
      hide: 599
    },
    {
      name: 'Date Tagged',
      selector: (row: SeaTurtleTagModel) => row.dateTagged ? moment(row.dateTagged).format('YYYY-MM-DD') : '',
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
    setCounties(CodeListTableService.getList(CodeTableType.County, true));
    setSpecies(CodeListTableService.getList(CodeTableType.Species, true));
    setTurtleSizes(CodeListTableService.getList(CodeTableType.TurtleSize, true));
    setTurtleStatuses(CodeListTableService.getList(CodeTableType.TurtleStatus, true));
  }, [resetSeaTurtle]);

  useEffect(() => {
    // make async server request
    const getSeaTurtles = async () => {
      const seaTurtles = await SeaTurtleService.getSeaTurtles(appContext.organizationId || '');
      setCurrentSeaTurtles(seaTurtles);
    };
    getSeaTurtles();
  }, [appContext.organizationId]);

  useEffect(() => {
    if (editingStarted && firstEditControlRef?.current !== null) {
      firstEditControlRef.current.focus();
    }
    setEditingStarted(false);
  }, [editingStarted]);

  const fetchSeaTurtle = (turtleId: string) => {
    // make async server request
    const getSeaTurtle = async () => {
      const seaTurtle = await SeaTurtleService.getSeaTurtle(turtleId);
      resetSeaTurtle(seaTurtle);
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
      resetSeaTurtle(seaTurtle);
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
      resetSeaTurtle(seaTurtle);
      setCurrentSeaTurtle(seaTurtle);
      setIsFormEnabled(true);
      setEditingStarted(true);
    };

    if (formStateSeaTurtle.dirty) {
      setSaveChangesDialogTitleText('Unsaved Changes');
      setSaveChangesDialogBodyText('Save changes?');
      setOnSaveChangesYes(() => async () => {
        await onSubmitSeaTurtle();
        handleEvent();
        setShowSaveChangesDialog(false);
      });
      setOnSaveChangesNo(() => () => {
        handleEvent();
        setShowSaveChangesDialog(false);
      });
      setOnSaveChangesCancel(() => () => {
        setShowSaveChangesDialog(false);
      });
      setShowSaveChangesDialog(true);
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

    if (formStateSeaTurtle.dirty) {
      setSaveChangesDialogTitleText('Unsaved Changes');
      setSaveChangesDialogBodyText('Save changes?');
      setOnSaveChangesYes(() => async () => {
        await onSubmitSeaTurtle();
        handleEvent();
        setShowSaveChangesDialog(false);
      });
      setOnSaveChangesNo(() => () => {
        handleEvent();
        setShowSaveChangesDialog(false);
      });
      setOnSaveChangesCancel(() => () => {
        setShowSaveChangesDialog(false);
      });
      setShowSaveChangesDialog(true);
    } else {
      handleEvent();
    }
  };

  const onDeleteSeaTurtleClick = (turtleId: string, turtleName: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    console.log('turtleId', turtleId);
    console.log('turtleName', turtleName);
    const handleEvent = () => {
      deleteSeaTurtle(turtleId);
      setIsFormEnabled(false);
    };

    setSaveChangesDialogTitleText('Confirm Deletion');
    setSaveChangesDialogBodyText(`Delete turtle '${turtleName}' ?`);
    setOnSaveChangesYes(() => async () => {
        handleEvent();
        setShowSaveChangesDialog(false);
      });
      setOnSaveChangesNo(() => () => {
        setShowSaveChangesDialog(false);
      });
      setOnSaveChangesCancel(() => () => {
        setShowSaveChangesDialog(false);
      });
      setShowSaveChangesDialog(true);
  };

  const onSubmitSeaTurtle = handleSubmitSeaTurtle((modifiedSeaTurtle: SeaTurtleModel) => {
    console.log('In onSubmit()', JSON.stringify(modifiedSeaTurtle));
    const patchedSeaTurtle = { ...currentSeaTurtle, ...modifiedSeaTurtle };
    SeaTurtleService.saveSeaTurtle(patchedSeaTurtle);
    resetSeaTurtle(patchedSeaTurtle);
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
    resetSeaTurtle(currentSeaTurtle);
  };

  const onEditSeaTurtleTagClick = (turtleTagId: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
  };

  const onDeleteSeaTurtleTagClick = (turtleTagId: string, tagNumber: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
  };

  new TabHelper().initialize();

  return (
    <div id='seaTurtle'>
      <LeaveThisPagePrompt isDirty={formStateSeaTurtle.dirty} />
      <YesNoCancelDialog 
        isActive={showSaveChangesDialog} 
        titleText={saveChangesDialogTitleText}
        bodyText={saveChangesDialogBodyText}
        onYes={onSaveChangesYes}
        onNo={onSaveChangesNo}
        onCancel={onSaveChangesCancel}
      />
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>Sea Turtles</h1>
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

          <FormContext {...seaTurtleMethods} >
            <form onSubmit={onSubmitSeaTurtle}>
              <fieldset disabled={!isFormEnabled}>
                <div className='tabs'>
                  <ul>
                    <li className='is-active'><a>General Information</a></li>
                    <li><a>Tags</a></li>
                    <li><a>Measurements</a></li>
                  </ul>
                </div>

                <div>
                  <section className='tab-content is-active'> {/* General Information */}
                    <FormFieldRow>
                      <TextFormField fieldName='turtleName' labelText='Name' validationOptions={{ required: 'Name is required' }} refObject={firstEditControlRef} />
                      <TextFormField fieldName='sidNumber' labelText='SID Number' />
                      <TextFormField fieldName='strandingIdNumber' labelText='Stranding ID Number' />
                    </FormFieldRow>
                    <FormFieldRow>
                      <ListFormField fieldName='species' labelText='Species' listItems={species} />
                      <ListFormField fieldName='turtleSize' labelText='Size' listItems={turtleSizes} />
                      <ListFormField fieldName='status' labelText='Status' listItems={turtleStatuses} />
                    </FormFieldRow>
                    <FormFieldRow>
                      <DateFormField fieldName='dateAcquired' labelText='Date Acquired' />
                      <TextFormField fieldName='acquiredFrom' labelText='Acquired From' />
                      <ListFormField fieldName='acquiredCounty' labelText='County' listItems={counties} />
                      <TextFormField fieldName='acquiredLatitude' labelText='Latitude' />
                      <TextFormField fieldName='acquiredLongitude' labelText='Longitude' />
                    </FormFieldRow>
                    <FormFieldRow>
                      <DateFormField fieldName='dateRelinquished' labelText='Date Relinquished' />
                      <TextFormField fieldName='relinquishedFrom' labelText='Relinquished From' />
                      <ListFormField fieldName='relinquishedCounty' labelText='County' listItems={counties} />
                      <TextFormField fieldName='relinquishedLatitude' labelText='Latitude' />
                      <TextFormField fieldName='relinquishedLongitude' labelText='Longitude' />
                     </FormFieldRow>
                    <FormFieldRow>
                      <TextareaFormField fieldName='anomalies' labelText='Anomalies' />
                      <FormFieldGroup fieldClass='checkbox-group' labelText='Injuries'>
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
                  </section>

                  <section className='tab-content'> {/* Tags */}
                  </section>

                  <section className='tab-content'> {/* Measurements */}
                  </section>
                </div>

                <div className='field is-grouped action-button-grouping'>
                  <p className='control'>
                    <input
                      type='button'
                      className='button is-danger is-fixed-width-medium'
                      value='Cancel'
                      onClick={() => onCancelSeaTurtle()}
                      disabled={!formStateSeaTurtle.dirty}
                    />
                  </p>

                  <p className='control'>
                    <input
                      type='submit'
                      className='button is-success is-fixed-width-medium'
                      value='Save'
                      disabled={!(formStateSeaTurtle.isValid && formStateSeaTurtle.dirty)}
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
