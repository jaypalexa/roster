import useMount from 'hooks/UseMount';
import React, { useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import browserHistory from '../../browserHistory';
import { useAppContext } from '../../contexts/AppContext';
import HoldingTankService from '../../services/HoldingTankService';
import HoldingTankModel from '../../types/HoldingTankModel';
import YesNoCancelDialog from '../Dialogs/YesNoCancelDialog';
import YesNoDialog from '../Dialogs/YesNoDialog';
import FormFieldRow from '../FormFields/FormFieldRow';
import TextFormField from '../FormFields/TextFormField';
import LeaveThisPagePrompt from '../LeaveThisPagePrompt/LeaveThisPagePrompt';
import './HoldingTanks.sass';

/* eslint-disable jsx-a11y/anchor-is-valid */

const HoldingTanks: React.FC = () => {

  // eslint-disable-next-line
  const [appContext, setAppContext] = useAppContext();
  const methods = useForm<HoldingTankModel>({ mode: 'onChange' });
  const { handleSubmit, formState, getValues, reset } = methods;
  const [currentHoldingTanks, setCurrentHoldingTanks] = useState([] as Array<HoldingTankModel>);
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
      cell: (row: HoldingTankModel) => <span className='icon cursor-pointer' onClick={(event) => { onEditHoldingTankClick(row.tankId, event) }}><i className='fa fa-pencil'></i></span>,
    },
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      cell: (row: HoldingTankModel) => <span className='icon cursor-pointer' onClick={(event) => { onDeleteHoldingTankClick(row.tankId, row.tankName, event) }}><i className='fa fa-trash'></i></span>,
    },
    {
      name: 'Name',
      selector: 'tankName',
      sortable: true
    },
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
    // make async server request
    const getHoldingTanks = async () => {
      const holdingTanks = await HoldingTankService.getHoldingTanks(appContext.organizationId || '');
      setCurrentHoldingTanks(holdingTanks);
      if (appContext.holdingTank?.tankId) {
        reset(appContext.holdingTank);
        setCurrentHoldingTank(appContext.holdingTank);
        setIsFormEnabled(true);
      }
    };
    getHoldingTanks();
  });

  useEffect(() => {
    if (editingStarted && firstEditControlRef?.current !== null) {
      firstEditControlRef.current.focus();
    }
    setEditingStarted(false);
  }, [editingStarted]);

  const setCurrentHoldingTank = (holdingTank: HoldingTankModel) => {
    setAppContext({ ...appContext, holdingTank: holdingTank });
  }

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

  const onAddButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const handleEvent = () => {
      const holdingTank = {} as HoldingTankModel;
      holdingTank.tankId = uuidv4();
      reset(holdingTank);
      setCurrentHoldingTank(holdingTank);
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

  const onEditHoldingTankClick = (tankId: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const handleEvent = () => {
      fetchHoldingTank(tankId);
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

  const onDeleteHoldingTankClick = (tankId: string, tankName: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const handleEvent = () => {
      deleteHoldingTank(tankId);
      setIsFormEnabled(false);
    };

    setDialogTitleText('Confirm Deletion');
    setDialogBodyText(`Delete tank '${tankName}' ?`);
    setOnDialogYes(() => async () => {
      handleEvent();
      setShowYesNoDialog(false);
    });
    setOnDialogNo(() => () => {
      setShowYesNoDialog(false);
    });
    setShowYesNoDialog(true);
  };

  const onSubmit = handleSubmit((modifiedHoldingTank: HoldingTankModel) => {
    saveHoldingTank(modifiedHoldingTank);
    toast.success('Record saved');
  });

  const saveHoldingTank = ((modifiedHoldingTank: HoldingTankModel) => {
    if (!formState.dirty) return;

    const patchedHoldingTank = { ...appContext.holdingTank, ...modifiedHoldingTank };
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
  });

  const saveAndNavigate = (linkTo: string) => {
    const modifiedHoldingTank: HoldingTankModel = getValues();
    saveHoldingTank(modifiedHoldingTank);
    setTimeout(() => {
      browserHistory.push(linkTo);
    }, 0);
  }

  const onCancel = () => {
    reset(appContext.holdingTank);
  };

  return (
    <div id='holdingTank'>
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
          <li className='is-active'><a href='#' aria-current='page'>Holding Tanks</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb shown-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>&#10094; Home</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered hidden-when-mobile'>Holding Tanks</h1>
          <div className='level'>
            <div className='level-left'></div>
            <div className='level-right'>
              <p className='level-item'>
                <button className='button is-link' onClick={onAddButtonClick}>
                  <span className='icon'>
                    <i className='fa fa-plus'></i>
                  </span>
                  &nbsp;&nbsp;&nbsp;Add Holding Tank
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
            customStyles={tableCustomStyles}
          />

          <hr />

          <h1 className='title has-text-centered'>{appContext.holdingTank?.tankName}</h1>

          <FormContext {...methods} >
            <form onSubmit={onSubmit}>
              <fieldset disabled={!isFormEnabled}>
                <h2 className='subtitle'>General Information</h2>
                <FormFieldRow>
                  <TextFormField fieldName='tankName' labelText='Name' validationOptions={{ required: 'Name is required' }} refObject={firstEditControlRef} />
                </FormFieldRow>
                <hr />

                <div
                  className={'child-navigation-container ' + (isFormEnabled ? '' : 'is-disabled')}
                  onClick={() => saveAndNavigate('/holding-tank-measurements')}>
                  <span className='child-navigation-item'>Water Measurements</span>
                  <span className='child-navigation-item'>&nbsp;&nbsp;&#10095;</span>
                </div>

                <div
                  className={'child-navigation-container ' + (isFormEnabled ? '' : 'is-disabled')}
                  onClick={() => saveAndNavigate('/holding-tank-graphs')}>
                  <span className='child-navigation-item'>Water Graphs</span>
                  <span className='child-navigation-item'>&nbsp;&nbsp;&#10095;</span>
                </div>

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

export default HoldingTanks;
