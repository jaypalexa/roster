import browserHistory from 'browserHistory';
import ChildNavigation from 'components/ChildNavigation/ChildNavigation';
import YesNoCancelDialog from 'components/Dialogs/YesNoCancelDialog';
import YesNoDialog from 'components/Dialogs/YesNoDialog';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import TextFormField from 'components/FormFields/TextFormField';
import LeaveThisPagePrompt from 'components/LeaveThisPagePrompt/LeaveThisPagePrompt';
import Spinner from 'components/Spinner/Spinner';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import HoldingTankModel from 'models/HoldingTankModel';
import React, { useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthenticationService from 'services/AuthenticationService';
import HoldingTankService from 'services/HoldingTankService';
import { constants } from 'utils';
import { v4 as uuidv4 } from 'uuid';
import './HoldingTanks.sass';

const HoldingTanks: React.FC = () => {

  const [appContext, setAppContext] = useAppContext();
  const methods = useForm<HoldingTankModel>({ mode: 'onChange' });
  const { handleSubmit, formState, getValues, reset } = methods;
  const [currentHoldingTanks, setCurrentHoldingTanks] = useState([] as Array<HoldingTankModel>);
  const [isFormEnabled, setIsFormEnabled] = useState(false);
  const [showYesNoCancelDialog, setShowYesNoCancelDialog] = useState(false);
  const [showYesNoDialog, setShowYesNoDialog] = useState(false);
  const [dialogTitleText, setDialogTitleText] = useState('');
  const [dialogBodyText, setDialogBodyText] = useState('');
  const [onDialogYes, setOnDialogYes] = useState<((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined>(() => { });
  const [onDialogNo, setOnDialogNo] = useState<((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined>(() => { });
  const [onDialogCancel, setOnDialogCancel] = useState<((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined>(() => { });
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
      cell: (row: HoldingTankModel) => <span className='icon cursor-pointer' onClick={() => onEditHoldingTankClick(row)}><i className='fa fa-pencil fa-lg' title='Edit'></i></span>,
    },
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      cell: (row: HoldingTankModel) => <span className='icon cursor-pointer' onClick={() => onDeleteHoldingTankClick(row)}><i className='fa fa-trash fa-lg' title='Delete'></i></span>,
    },
    {
      name: 'Name',
      selector: 'holdingTankName',
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
    const getHoldingTanks = async () => {
      try {
        setShowSpinner(true);
        const holdingTanks = await HoldingTankService.getHoldingTanks();
        setCurrentHoldingTanks(holdingTanks);
        if (appContext.holdingTank?.holdingTankId && appContext.holdingTank?.organizationId === AuthenticationService.getOrganizationId()) {
          reset(appContext.holdingTank);
          setCurrentHoldingTank(appContext.holdingTank);
          setIsFormEnabled(true);
        }
      } 
      catch (err) {
        console.log(err);
        toast.error(constants.ERROR.GENERIC);
      }
      finally {
        setShowSpinner(false);
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

  const fetchHoldingTank = async (holdingTankId: string) => {
    try {
      setShowSpinner(true);
      const holdingTank = await HoldingTankService.getHoldingTank(holdingTankId);
      reset(holdingTank);
      setCurrentHoldingTank(holdingTank);
    } 
    catch (err) {
      console.log(err);
      toast.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  };

  const deleteHoldingTank = (holdingTankId: string) => {
    try {
      setShowSpinner(true);
      const deleteHoldingTank = async () => {
        await HoldingTankService.deleteHoldingTank(holdingTankId);
        const holdingTank = {} as HoldingTankModel;
        reset(holdingTank);
        setCurrentHoldingTank(holdingTank);
        const index = currentHoldingTanks.findIndex(x => x.holdingTankId === holdingTankId);
      if (~index) {
          var updatedCurrentHoldingTanks = [...currentHoldingTanks];
          updatedCurrentHoldingTanks.splice(index, 1)
          setCurrentHoldingTanks(updatedCurrentHoldingTanks);
      }
    };
      deleteHoldingTank();
    } 
    catch (err) {
      console.log(err);
      toast.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  };

  const onAddButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const handleEvent = () => {
      const holdingTank = {} as HoldingTankModel;
      holdingTank.holdingTankId = uuidv4().toLowerCase();
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

  const onEditHoldingTankClick = (holdingTank: HoldingTankModel) => {
    const handleEvent = () => {
      fetchHoldingTank(holdingTank.holdingTankId);
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

  const onDeleteHoldingTankClick = (holdingTank: HoldingTankModel) => {
    const handleEvent = () => {
      deleteHoldingTank(holdingTank.holdingTankId);
      setIsFormEnabled(false);
    };

    setDialogTitleText('Confirm Deletion');
    setDialogBodyText(`Delete tank '${holdingTank.holdingTankName}'?`);
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

  const saveHoldingTank = async (modifiedHoldingTank: HoldingTankModel) => {
    if (!formState.dirty) return;

    try {
      setShowSpinner(true);
      const patchedHoldingTank = { ...appContext.holdingTank, ...modifiedHoldingTank };
      await HoldingTankService.saveHoldingTank(patchedHoldingTank);
      reset(patchedHoldingTank);
      setCurrentHoldingTank(patchedHoldingTank);
      const index = currentHoldingTanks.findIndex(x => x.holdingTankId === patchedHoldingTank.holdingTankId);
    if (~index) {
        currentHoldingTanks[index] = { ...patchedHoldingTank };
    } else {
        currentHoldingTanks.push(patchedHoldingTank);
      }
      setCurrentHoldingTanks([...currentHoldingTanks]);
    } 
    catch (err) {
      console.log(err);
      toast.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  };

  const onChildNavigationClick = async (linkTo: string) => {
    const modifiedHoldingTank: HoldingTankModel = getValues();
    await saveHoldingTank(modifiedHoldingTank);
    setTimeout(() => {
      browserHistory.push(linkTo);
    }, 0);
  }

  const onCancel = () => {
    reset(appContext.holdingTank);
  };

  return (
    <div id='holdingTank'>
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
          <li className='is-active'><a href='/#' aria-current='page'>Holding Tanks</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb shown-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>&#10094; Home</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>Holding Tanks</h1>
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

          <DataTableExtensions 
            columns={tableColumns} 
            data={currentHoldingTanks} 
            export={false} 
            print={false}
          >
            <DataTable
              title='Holding Tanks'
              columns={tableColumns}
              data={currentHoldingTanks}
              keyField='holdingTankId'
              defaultSortField='holdingTankName'
              noHeader={true}
              fixedHeader={true}
              fixedHeaderScrollHeight='9rem'
              customStyles={tableCustomStyles}
              pagination
              highlightOnHover
              onRowClicked={onEditHoldingTankClick}
            />
          </DataTableExtensions>
          <hr />

          <h1 className='title has-text-centered'>{appContext.holdingTank?.holdingTankName}</h1>

          <FormContext {...methods} >
            <form onSubmit={onSubmit}>
              <fieldset disabled={!isFormEnabled}>
                <h2 className='subtitle'>General Information</h2>
                <FormFieldRow>
                  <TextFormField fieldName='holdingTankName' labelText='Name' validationOptions={{ required: 'Name is required' }} refObject={firstEditControlRef} />
                </FormFieldRow>
                <hr />

                <ChildNavigation itemName='Water Measurements' 
                  disabled={!isFormEnabled} 
                  onClick={() => onChildNavigationClick('/holding-tank-measurements')} />

                <ChildNavigation itemName='Water Graphs' 
                  disabled={!isFormEnabled} 
                  onClick={() => onChildNavigationClick('/holding-tank-graphs')} />

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
