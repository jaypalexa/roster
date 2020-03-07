import React, { useEffect, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../../contexts/AppContext';
import TabHelper from '../../helpers/TabHelper';
import CodeListTableService, { CodeTableType } from '../../services/CodeTableListService';
import SeaTurtleService from '../../services/SeaTurtleService';
import NameValuePair from '../../types/NameValuePair';
import SeaTurtleModel from '../../types/SeaTurtleModel';
import DateFormField from '../FormFields/DateFormField';
import FormFieldRow from '../FormFields/FormFieldRow';
import ListFormField from '../FormFields/ListFormField';
import TextFormField from '../FormFields/TextFormField';
import UnsavedChangesDialog from '../UnsavedChanges/UnsavedChangesDialog';
import UnsavedChangesWhenLeavingPrompt from '../UnsavedChanges/UnsavedChangesWhenLeavingPrompt';
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
  const [showYesNoDialog, setShowYesNoDialog] = useState(false);
  const [yesNoDialogTitleText, setYesNoDialogTitleText] = useState('');
  const [yesNoDialogBodyText, setYesNoDialogBodyText] = useState('');
  const [onYesNoDialogConfirm, setOnYesNoConfirm] = useState(() => { });
  const [onYesNoDialogCancel, setOnYesNoCancel] = useState(() => { });

  // console.log(JSON.stringify(formState));
  // console.log(JSON.stringify(methods.errors));

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
      setYesNoDialogTitleText('Unsaved Changes');
      setYesNoDialogBodyText('Save changes?');
      setOnYesNoConfirm(() => async () => {
        await onSubmit();
        handleEvent();
        setShowYesNoDialog(false);
      });
      setOnYesNoCancel(() => () => {
        handleEvent();
        setShowYesNoDialog(false);
      });
      setShowYesNoDialog(true);
    } else {
      handleEvent();
    }
  };

  const onEditTurtleClick = (event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => {
    const turtleId = event.currentTarget.parentElement!.getAttribute('data-turtle-id') || '';
    console.log('turtleId', turtleId);
    const handleEvent = () => {
      fetchSeaTurtle(turtleId);
      setIsFormEnabled(true);
    };

    if (formState.dirty) {
      setYesNoDialogTitleText('Unsaved Changes');
      setYesNoDialogBodyText('Save changes?');
      setOnYesNoConfirm(() => async () => {
        await onSubmit();
        handleEvent();
        setShowYesNoDialog(false);
      });
      setOnYesNoCancel(() => () => {
        handleEvent();
        setShowYesNoDialog(false);
      });
      setShowYesNoDialog(true);
    } else {
      handleEvent();
    }
  };

  const onDeleteTurtleClick = (event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => {
    const turtleId = event.currentTarget.parentElement!.getAttribute('data-turtle-id') || '';
    const turtleName = event.currentTarget.parentElement!.getAttribute('data-turtle-name') || '';
    console.log('turtleId', turtleId);
    console.log('turtleName', turtleName);
    const handleEvent = () => {
      deleteSeaTurtle(turtleId);
      setIsFormEnabled(false);
    };

    setYesNoDialogTitleText('Confirm Deletion');
    setYesNoDialogBodyText(`Delete turtle '${turtleName}' ?`);
    setOnYesNoConfirm(() => async () => {
        handleEvent();
        setShowYesNoDialog(false);
      });
      setOnYesNoCancel(() => () => {
        setShowYesNoDialog(false);
      });
      setShowYesNoDialog(true);
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
    toast.success('Record saved');
  });

  const onCancel = () => {
    reset(currentSeaTurtle);
  };

  new TabHelper().initialize();

  return (
    <div id='seaTurtle'>
      <UnsavedChangesWhenLeavingPrompt isDirty={formState.dirty} />
      <UnsavedChangesDialog 
        isActive={showYesNoDialog} 
        titleText={yesNoDialogTitleText}
        bodyText={yesNoDialogBodyText}
        onConfirm={onYesNoDialogConfirm}
        onCancel={onYesNoDialogCancel}
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
          <table className='table is-fullwidth is-bordered is-narrow table-header'>
            <thead>
              <tr>
                <th className='column-width-x-small'>
                  <span className='icon transparent'>
                    <i className='fa fa-pencil'></i>
                  </span>
                </th>
                <th className='column-width-x-small'>
                  <span className='icon transparent'>
                    <i className='fa fa-trash'></i>
                  </span>
                </th>
                <th className='column-width-small'>Name</th>
                <th className='column-width-medium'>SID #</th>
                <th className='column-width-small'>Species</th>
                <th className='column-width-medium'>Size</th>
                <th>Status</th>
              </tr>
            </thead>
          </table>
          <div className='sea-turtle-table-container'>
            <table className='table is-striped is-hoverable is-fullwidth is-bordered is-narrow'>
              <tbody>
                {
                  currentSeaTurtles.map((seaTurtle) => {
                    return <tr key={seaTurtle.turtleId} data-turtle-id={seaTurtle.turtleId} data-turtle-name={seaTurtle.turtleName}>
                      <td className='column-width-x-small cursor-pointer' onClick={onEditTurtleClick}>
                        <span className='icon'>
                          <i className='fa fa-pencil'></i>
                        </span>
                      </td>
                      <td className='column-width-x-small cursor-pointer' onClick={onDeleteTurtleClick}>
                        <span className='icon'>
                          <i className='fa fa-trash'></i>
                        </span>
                      </td>
                      <td className='column-width-small'>{seaTurtle.turtleName}</td>
                      <td className='column-width-medium'>{seaTurtle.sidNumber}</td>
                      <td className='column-width-small'>{seaTurtle.species}</td>
                      <td className='column-width-medium'>{seaTurtle.turtleSize}</td>
                      <td>{seaTurtle.status}</td>
                    </tr>
                  })
                }
              </tbody>
            </table>
          </div>

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
