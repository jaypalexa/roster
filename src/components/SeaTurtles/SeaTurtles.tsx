import React, { useEffect, useState } from 'react';
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
import YesNoCancelDialog from '../Dialogs/YesNoCancelDialog';
import DateFormField from '../FormFields/DateFormField';
import FormFieldRow from '../FormFields/FormFieldRow';
import ListFormField from '../FormFields/ListFormField';
import TextFormField from '../FormFields/TextFormField';
import LeaveThisPagePrompt from '../LeaveThisPagePrompt/LeaveThisPagePrompt';
import './SeaTurtles.sass';

/* eslint-disable jsx-a11y/anchor-is-valid */

const SeaTurtles: React.FC = () => {

  // eslint-disable-next-line
  const [appContext, setAppContext] = useAppContext();
  const methods = useForm<SeaTurtleModel>({ mode: 'onChange' });
  const { handleSubmit, formState, reset } = methods;
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

  // console.log(JSON.stringify(formState));
  // console.log(JSON.stringify(methods.errors));

  const tableColumns = [
      {
        name: '',
        ignoreRowClick: true,
        maxWidth: '2rem',
        minWidth: '2rem',
        style: '{padding-left: 1rem}',
        cell: (row: SeaTurtleModel) => <span className='icon cursor-pointer' onClick={(event) => {onEditTurtleClick(row.turtleId, event)}}><i className='fa fa-pencil'></i></span>,
      },
      {
        name: '',
        ignoreRowClick: true,
        maxWidth: '2rem',
        minWidth: '2rem',
        cell: (row: SeaTurtleModel) => <span className='icon cursor-pointer' onClick={(event) => {onDeleteTurtleClick(row.turtleId, row.turtleName, event)}}><i className='fa fa-trash'></i></span>,
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
  ];

  useEffect(() => {
    setCounties(CodeListTableService.getList(CodeTableType.County, true));
    setSpecies(CodeListTableService.getList(CodeTableType.Species, true));
    setTurtleSizes(CodeListTableService.getList(CodeTableType.TurtleSize, true));
    setTurtleStatuses(CodeListTableService.getList(CodeTableType.TurtleStatus, true));
  }, [reset]);

  useEffect(() => {
    // make async server request
    const getSeaTurtles = async () => {
      const seaTurtles = await SeaTurtleService.getSeaTurtles(appContext.organizationId || '');
      setCurrentSeaTurtles(seaTurtles);
    };
    getSeaTurtles();
  }, [appContext.organizationId]);

  const fetchSeaTurtle = (turtleId: string) => {
    // make async server request
    const getSeaTurtle = async () => {
      const seaTurtle = await SeaTurtleService.getSeaTurtle(turtleId);
      reset(seaTurtle);
      setCurrentSeaTurtle(seaTurtle);
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

  const onAddNewButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const handleEvent = () => {
      const seaTurtle = {} as SeaTurtleModel;
      seaTurtle.turtleId = uuidv4();
      reset(seaTurtle);
      setCurrentSeaTurtle(seaTurtle);
      setIsFormEnabled(true);
    };

    if (formState.dirty) {
      setSaveChangesDialogTitleText('Unsaved Changes');
      setSaveChangesDialogBodyText('Save changes?');
      setOnSaveChangesYes(() => async () => {
        await onSubmit();
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

  const onEditTurtleClick = (turtleId: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    console.log('turtleId', turtleId);
    const handleEvent = () => {
      fetchSeaTurtle(turtleId);
      setIsFormEnabled(true);
    };

    if (formState.dirty) {
      setSaveChangesDialogTitleText('Unsaved Changes');
      setSaveChangesDialogBodyText('Save changes?');
      setOnSaveChangesYes(() => async () => {
        await onSubmit();
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

  const onDeleteTurtleClick = (turtleId: string, turtleName: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
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

  const onSubmit = handleSubmit((modifiedSeaTurtle: SeaTurtleModel) => {
    console.log('In onSubmit()', JSON.stringify(modifiedSeaTurtle));
    const patchedSeaTurtle = { ...currentSeaTurtle, ...modifiedSeaTurtle };
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

  const onCancel = () => {
    reset(currentSeaTurtle);
  };

  new TabHelper().initialize();

  return (
    <div id='seaTurtle'>
      <LeaveThisPagePrompt isDirty={formState.dirty} />
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
                <button className='button is-link' onClick={onAddNewButtonClick}>
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
            columns={tableColumns}
            data={currentSeaTurtles}
            keyField='turtleId'
            defaultSortField='turtleName'
            noHeader={true}
            fixedHeader={true}
            fixedHeaderScrollHeight='9rem'
          />

          <hr />

          <FormContext {...methods} >
            <form onSubmit={onSubmit}>
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
                      <TextFormField fieldName='turtleName' labelText='Name' validationOptions={{ required: 'Name is required' }} />
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
                      onClick={() => onCancel()}
                      disabled={!formState.dirty}
                    />
                  </p>

                  <p className='control'>
                    <input
                      type='submit'
                      className='button is-success is-fixed-width-medium'
                      value='Save'
                      disabled={!(formState.isValid && formState.dirty)}
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
