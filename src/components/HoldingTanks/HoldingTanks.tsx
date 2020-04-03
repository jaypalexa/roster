import React, { useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FormContext, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../../contexts/AppContext';
import TabHelper from '../../helpers/TabHelper';
import HoldingTankService from '../../services/HoldingTankService';
import HoldingTankModel from '../../types/HoldingTankModel';
import YesNoCancelDialog from '../Dialogs/YesNoCancelDialog';
import FormFieldRow from '../FormFields/FormFieldRow';
import TextFormField from '../FormFields/TextFormField';
import LeaveThisPagePrompt from '../LeaveThisPagePrompt/LeaveThisPagePrompt';
import './HoldingTanks.sass';

/* eslint-disable jsx-a11y/anchor-is-valid */

const HoldingTanks: React.FC = () => {

  // eslint-disable-next-line
  const [appContext, setAppContext] = useAppContext();
  const methods = useForm<HoldingTankModel>({ mode: 'onChange' });
  const { handleSubmit, formState, reset } = methods;
  const [currentHoldingTank, setCurrentHoldingTank] = useState({} as HoldingTankModel);
  const [currentHoldingTanks, setCurrentHoldingTanks] = useState([] as Array<HoldingTankModel>);
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

  const tableColumns = [
      {
        name: '',
        ignoreRowClick: true,
        maxWidth: '2rem',
        minWidth: '2rem',
        style: '{padding-left: 1rem}',
        cell: (row: HoldingTankModel) => <span className='icon cursor-pointer' onClick={(event) => {onEditTurtleClick(row.tankId, event)}}><i className='fa fa-pencil'></i></span>,
      },
      {
        name: '',
        ignoreRowClick: true,
        maxWidth: '2rem',
        minWidth: '2rem',
        cell: (row: HoldingTankModel) => <span className='icon cursor-pointer' onClick={(event) => {onDeleteTurtleClick(row.tankId, row.tankName, event)}}><i className='fa fa-trash'></i></span>,
      },
      {
      name: 'Name',
      selector: 'tankName',
      sortable: true
    },
  ];

  useEffect(() => {
    // make async server request
    const getHoldingTanks = async () => {
      const holdingTanks = await HoldingTankService.getHoldingTanks(appContext.organizationId || '');
      setCurrentHoldingTanks(holdingTanks);
    };
    getHoldingTanks();
  }, [appContext.organizationId]);

  useEffect(() => {
    if (editingStarted && firstEditControlRef?.current !== null) {
      firstEditControlRef.current.focus();
    }
    setEditingStarted(false);
  }, [editingStarted]);

  const fetchHoldingTank = (tankId: string) => {
    // make async server request
    const getHoldingTank = async () => {
      const holdingTank = await HoldingTankService.getHoldingTank(tankId);
      reset(holdingTank);
      setCurrentHoldingTank(holdingTank);
    };
    getHoldingTank();
  };

  const deleteHoldingTank = (tankId: string) => {
    // make async server request
    const deleteHoldingTank = async () => {
      await HoldingTankService.deleteHoldingTank(tankId);
      const holdingTank = {} as HoldingTankModel;
      reset(holdingTank);
      setCurrentHoldingTank(holdingTank);
      const index = currentHoldingTanks.findIndex(x => x.tankId === tankId);
      if (~index) {
        var updatedCurrentHoldingTanks = [...currentHoldingTanks];
        updatedCurrentHoldingTanks.splice(index, 1)
        setCurrentHoldingTanks(updatedCurrentHoldingTanks);
      }
    };
    deleteHoldingTank();
  };

  const onAddNewButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const handleEvent = () => {
      const holdingTank = {} as HoldingTankModel;
      holdingTank.tankId = uuidv4();
      reset(holdingTank);
      setCurrentHoldingTank(holdingTank);
      setIsFormEnabled(true);
      setEditingStarted(true);
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

  const onEditTurtleClick = (tankId: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const handleEvent = () => {
      fetchHoldingTank(tankId);
      setIsFormEnabled(true);
      setEditingStarted(true);
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

  const onDeleteTurtleClick = (tankId: string, tankName: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    console.log('tankId', tankId);
    console.log('tankName', tankName);
    const handleEvent = () => {
      deleteHoldingTank(tankId);
      setIsFormEnabled(false);
    };

    setSaveChangesDialogTitleText('Confirm Deletion');
    setSaveChangesDialogBodyText(`Delete tank '${tankName}' ?`);
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

  const onSubmit = handleSubmit((modifiedHoldingTank: HoldingTankModel) => {
    console.log('In onSubmit()', JSON.stringify(modifiedHoldingTank));
    const patchedHoldingTank = { ...currentHoldingTank, ...modifiedHoldingTank };
    HoldingTankService.saveHoldingTank(patchedHoldingTank);
    reset(patchedHoldingTank);
    setCurrentHoldingTank(patchedHoldingTank);
    const index = currentHoldingTanks.findIndex(x => x.tankId === patchedHoldingTank.tankId);
    if (~index) {
      currentHoldingTanks[index] = { ...patchedHoldingTank };
    } else {
      currentHoldingTanks.push(patchedHoldingTank);
    }
    setCurrentHoldingTanks([...currentHoldingTanks]);

    toast.success('Record saved');
  });

  const onCancel = () => {
    reset(currentHoldingTank);
  };

  new TabHelper().initialize();

  return (
    <div id='holdingTank'>
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
          <h1 className='title has-text-centered'>Holding Tanks</h1>
          <div className='level'>
            <div className='level-left'></div>
            <div className='level-right'>
              <p className='level-item'>
                <button className='button is-link' onClick={onAddNewButtonClick}>
                  <span className='icon'>
                    <i className='fa fa-plus'></i>
                  </span>
                  &nbsp;&nbsp;&nbsp;Add New Holding Tank
                </button>
              </p>
            </div>
          </div>

          <DataTable
            title='Holding Tanks'
            columns={tableColumns}
            data={currentHoldingTanks}
            keyField='tankId'
            defaultSortField='tankName'
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
                    <li><a>Measurements</a></li>
                    <li><a>Temperature Graph</a></li>
                    <li><a>Salinity Graph</a></li>
                    <li><a>pH Graph</a></li>
                  </ul>
                </div>

                <div>
                  <section className='tab-content is-active'> {/* General Information */}
                    <FormFieldRow>
                      <TextFormField 
                        fieldName='tankName' 
                        labelText='Name' 
                        validationOptions={{ required: 'Name is required' }} 
                        refObject={firstEditControlRef} 
                      />
                    </FormFieldRow>
                  </section>

                  <section className='tab-content'> {/* Measurements */}
                  </section>

                  <section className='tab-content'> {/* Temperature Graph */}
                  </section>

                  <section className='tab-content'> {/* Salinity Graph */}
                  </section>

                  <section className='tab-content'> {/* pH Graph */}
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

export default HoldingTanks;
