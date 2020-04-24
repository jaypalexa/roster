import useMount from 'hooks/UseMount';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import browserHistory from '../../browserHistory';
import { useAppContext } from '../../contexts/AppContext';
import HoldingTankMeasurementService from '../../services/HoldingTankMeasurementService';
import HoldingTankMeasurementModel from '../../types/HoldingTankMeasurementModel';
import YesNoCancelDialog from '../Dialogs/YesNoCancelDialog';
import YesNoDialog from '../Dialogs/YesNoDialog';
import DateFormField from '../FormFields/DateFormField';
import DecimalFormField from '../FormFields/DecimalFormField';
import FormFieldRow from '../FormFields/FormFieldRow';
import LeaveThisPagePrompt from '../LeaveThisPagePrompt/LeaveThisPagePrompt';
import './HoldingTankMeasurements.sass';

/* eslint-disable jsx-a11y/anchor-is-valid */

const HoldingTankMeasurements: React.FC = () => {

  // eslint-disable-next-line
  const [appContext, setAppContext] = useAppContext();
  const methods = useForm<HoldingTankMeasurementModel>({ mode: 'onChange' });
  const { handleSubmit, formState, reset } = methods;
  const [currentHoldingTankMeasurement, setCurrentHoldingTankMeasurement] = useState({} as HoldingTankMeasurementModel);
  const [currentHoldingTankMeasurements, setCurrentHoldingTankMeasurements] = useState([] as Array<HoldingTankMeasurementModel>);
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
      cell: (row: HoldingTankMeasurementModel) => <span className='icon cursor-pointer' onClick={(event) => { onEditHoldingTankMeasurementClick(row.tankMeasurementId, event) }}><i className='fa fa-pencil'></i></span>,
    },
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      cell: (row: HoldingTankMeasurementModel) => <span className='icon cursor-pointer' onClick={(event) => { onDeleteHoldingTankMeasurementClick(row.tankMeasurementId, row.dateMeasured ? moment(row.dateMeasured).format('YYYY-MM-DD') : '', event) }}><i className='fa fa-trash'></i></span>,
    },
    {
      name: 'Date Measured',
      selector: (row: HoldingTankMeasurementModel) => row.dateMeasured ? moment(row.dateMeasured).format('YYYY-MM-DD') : '',
      sortable: true
    },
    {
      name: 'Temperature',
      selector: 'temperature',
      sortable: true
    },
    {
      name: 'Salinity',
      selector: 'salinity',
      sortable: true
    },
    {
      name: 'pH',
      selector: 'ph',
      sortable: true
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
    // make async server request
    if (!appContext.holdingTank?.tankId) {
      browserHistory.push('/holding-tanks')
    } else {
      const getHoldingTankMeasurementsForTank = async () => {
        const holdingTankMeasurements = await HoldingTankMeasurementService.getHoldingTankMeasurementsForTank(appContext.holdingTank?.tankId);
        setCurrentHoldingTankMeasurements(holdingTankMeasurements);
      };
      getHoldingTankMeasurementsForTank();
    }
  });

  useEffect(() => {
    if (editingStarted && firstEditControlRef?.current !== null) {
      firstEditControlRef.current.focus();
    }
    setEditingStarted(false);
  }, [editingStarted]);

  const fetchHoldingTankMeasurement = (holdingTankMeasurementId: string) => {
    // make async server request
    const getHoldingTankMeasurement = async () => {
      const holdingTankMeasurement = await HoldingTankMeasurementService.getHoldingTankMeasurement(holdingTankMeasurementId);
      reset(holdingTankMeasurement);
      setCurrentHoldingTankMeasurement(holdingTankMeasurement);
    };
    getHoldingTankMeasurement();
  };

  const deleteHoldingTankMeasurement = (holdingTankMeasurementId: string) => {
    // make async server request
    const deleteHoldingTankMeasurement = async () => {
      await HoldingTankMeasurementService.deleteHoldingTankMeasurement(holdingTankMeasurementId);
      const holdingTankMeasurement = {} as HoldingTankMeasurementModel;
      reset(holdingTankMeasurement);
      setCurrentHoldingTankMeasurement(holdingTankMeasurement);
      const index = currentHoldingTankMeasurements.findIndex(x => x.tankMeasurementId === holdingTankMeasurementId);
      if (~index) {
        var updatedCurrentHoldingTankMeasurements = [...currentHoldingTankMeasurements];
        updatedCurrentHoldingTankMeasurements.splice(index, 1)
        setCurrentHoldingTankMeasurements(updatedCurrentHoldingTankMeasurements);
      }
    };
    deleteHoldingTankMeasurement();
  };

  const onAddHoldingTankMeasurementButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const handleEvent = () => {
      const holdingTankMeasurement = {} as HoldingTankMeasurementModel;
      holdingTankMeasurement.tankMeasurementId = uuidv4();
      holdingTankMeasurement.tankId = appContext.holdingTank?.tankId || '';
      reset(holdingTankMeasurement);
      setCurrentHoldingTankMeasurement(holdingTankMeasurement);
      setIsFormEnabled(true);
      setEditingStarted(true);
    };

    if (formState.dirty) {
      setDialogTitleText('Unsaved Changes');
      setDialogBodyText('Save changes?');
      setOnDialogYes(() => async () => {
        await onSubmitHoldingTankMeasurement();
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

  const onEditHoldingTankMeasurementClick = (holdingTankMeasurementId: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const handleEvent = () => {
      fetchHoldingTankMeasurement(holdingTankMeasurementId);
      setIsFormEnabled(true);
    };

    if (formState.dirty) {
      setDialogTitleText('Unsaved Changes');
      setDialogBodyText('Save changes?');
      setOnDialogYes(() => async () => {
        await onSubmitHoldingTankMeasurement();
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

  const onDeleteHoldingTankMeasurementClick = (holdingTankMeasurementId: string, tagNumber: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const handleEvent = () => {
      deleteHoldingTankMeasurement(holdingTankMeasurementId);
      setIsFormEnabled(false);
    };

    setDialogTitleText('Confirm Deletion');
    setDialogBodyText(`Delete measurement '${tagNumber}' ?`);
    setOnDialogYes(() => async () => {
      handleEvent();
      setShowYesNoDialog(false);
    });
    setOnDialogNo(() => () => {
      setShowYesNoDialog(false);
    });
    setShowYesNoDialog(true);
  };

  const onSubmitHoldingTankMeasurement = handleSubmit((modifiedHoldingTankMeasurement: HoldingTankMeasurementModel) => {
    const patchedHoldingTankMeasurement = { ...currentHoldingTankMeasurement, ...modifiedHoldingTankMeasurement };
    HoldingTankMeasurementService.saveHoldingTankMeasurement(patchedHoldingTankMeasurement);
    reset(patchedHoldingTankMeasurement);
    setCurrentHoldingTankMeasurement(patchedHoldingTankMeasurement);
    const index = currentHoldingTankMeasurements.findIndex(x => x.tankMeasurementId === patchedHoldingTankMeasurement.tankMeasurementId);
    if (~index) {
      currentHoldingTankMeasurements[index] = { ...patchedHoldingTankMeasurement };
    } else {
      currentHoldingTankMeasurements.push(patchedHoldingTankMeasurement);
    }
    setCurrentHoldingTankMeasurements([...currentHoldingTankMeasurements]);

    toast.success('Record saved');
  });

  const onCancelHoldingTankMeasurement = () => {
    reset(currentHoldingTankMeasurement);
  };

  return (
    <div id='holdingTankMeasurement'>
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
          <li><Link to='/holding-tanks'>Holding Tanks</Link></li>
          <li className='is-active'><a href='#' aria-current='page'>Water Measurements</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb shown-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/holding-tanks'>&#10094; Holding Tanks</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>Water Measurements for {appContext.holdingTank?.tankName}</h1>
          <div className='level'>
            <div className='level-left'></div>
            <div className='level-right'>
              <p className='level-item'>
                <button className='button is-link' onClick={onAddHoldingTankMeasurementButtonClick}>
                  <span className='icon'>
                    <i className='fa fa-plus'></i>
                  </span>
                  &nbsp;&nbsp;&nbsp;Add Water Measurement
                </button>
              </p>
            </div>
          </div>

          <DataTable
            title='Water Measurements'
            columns={tableColumns}
            data={currentHoldingTankMeasurements}
            keyField='holdingTankMeasurementId'
            defaultSortField='dateMeasured'
            noHeader={true}
            fixedHeader={true}
            fixedHeaderScrollHeight='9rem'
            customStyles={tableCustomStyles}
          />

          <hr />

          <FormContext {...methods} >
            <form onSubmit={onSubmitHoldingTankMeasurement}>
              <fieldset disabled={!isFormEnabled}>
                <FormFieldRow>
                  <DateFormField fieldName='dateMeasured' labelText='Date Measured' validationOptions={{ required: 'Date Measured is required' }} refObject={firstEditControlRef} />
                  <DecimalFormField fieldName='temperature' labelText='Temperature' decimalPlaces={2} />
                  <DecimalFormField fieldName='salinity' labelText='Salinity' decimalPlaces={2} />
                  <DecimalFormField fieldName='ph' labelText='pH' decimalPlaces={2} />
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
                      onClick={() => onCancelHoldingTankMeasurement()}
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

export default HoldingTankMeasurements;
