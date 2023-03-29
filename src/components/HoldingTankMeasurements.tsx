import { Box, Breadcrumbs, Button, Divider, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import browserHistory from 'browserHistory';
import clsx from 'clsx';
import YesNoCancelDialog from 'components/Dialogs/YesNoCancelDialog';
import YesNoDialog from 'components/Dialogs/YesNoDialog';
import DateFormField from 'components/FormFields/DateFormField';
import DecimalFormField from 'components/FormFields/DecimalFormField';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import Icon from 'components/Icon';
import LeaveThisPagePrompt from 'components/LeaveThisPagePrompt';
import Spinner from 'components/Spinner/Spinner';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import HoldingTankMeasurementModel from 'models/HoldingTankMeasurementModel';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import HoldingTankMeasurementService from 'services/HoldingTankMeasurementService';
import ToastService from 'services/ToastService';
import sharedStyles from 'styles/sharedStyles';
import { clone, constants } from 'utils';
import { v4 as uuidv4 } from 'uuid';
import DisplayTable from './DisplayTable';

const HoldingTankMeasurements: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(sharedStyles(theme))
  );
  const classes = useStyles();

  const [appContext] = useAppContext();
  const methods = useForm<HoldingTankMeasurementModel>({ mode: 'onChange', defaultValues: new HoldingTankMeasurementModel(), shouldUnregister: false });
  const { handleSubmit, formState, reset } = methods;
  const [currentHoldingTankMeasurement, setCurrentHoldingTankMeasurement] = useState(new HoldingTankMeasurementModel());
  const [currentHoldingTankMeasurements, setCurrentHoldingTankMeasurements] = useState([] as Array<HoldingTankMeasurementModel>);
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

  const tableColumns = useMemo(() => [
    {
      name: 'Date Measured',
      selector: 'dateMeasured',
      sortable: true,
    },
    {
      name: 'Temperature',
      selector: 'temperature',
      sortable: true,
      right: true,
    },
    {
      name: 'Salinity',
      selector: 'salinity',
      sortable: true,
      right: true,
    },
    {
      name: 'pH',
      selector: 'ph',
      sortable: true,
      right: true,
    }
  ], []);

  /* scroll to top */
  useMount(() => {
    window.scrollTo(0, 0);
  });

  /* fetch table data */
  useMount(() => {
    const holdingTankId = appContext.holdingTank?.holdingTankId;
    if (!holdingTankId) {
      browserHistory.push('/holding-tanks')
    } else {
      const getHoldingTankMeasurements = async () => {
        try {
          setShowSpinner(true);
          const holdingTankMeasurements = await HoldingTankMeasurementService.getHoldingTankMeasurements(holdingTankId);
          setCurrentHoldingTankMeasurements(holdingTankMeasurements);
        }
        catch (err) {
          console.log(err);
          ToastService.error(constants.ERROR.GENERIC);
        }
        finally {
          setShowSpinner(false);
        }
      };
      getHoldingTankMeasurements();
    } 
  });

  useEffect(() => {
    if (editingStarted && firstEditControlRef?.current !== null) {
      firstEditControlRef.current.focus();
    }
    setEditingStarted(false);
  }, [editingStarted]);

  const fetchHoldingTankMeasurement = async (holdingTankMeasurementId: string) => {
    try {
      const holdingTankId = appContext.holdingTank?.holdingTankId;
      if (!holdingTankId) return;
      
      setShowSpinner(true);
      const holdingTankMeasurement = await HoldingTankMeasurementService.getHoldingTankMeasurement(holdingTankId, holdingTankMeasurementId);
      reset(holdingTankMeasurement);
      setCurrentHoldingTankMeasurement(clone(holdingTankMeasurement));
    } 
    catch (err) {
      console.log(err);
      ToastService.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  };

  const deleteHoldingTankMeasurement = async (holdingTankMeasurementId: string) => {
    const holdingTankId = appContext.holdingTank?.holdingTankId;
    if (!holdingTankId) return;
    
    try {
      setShowSpinner(true);
      await HoldingTankMeasurementService.deleteHoldingTankMeasurement(holdingTankId, holdingTankMeasurementId);
      const holdingTankMeasurement = new HoldingTankMeasurementModel();
      reset(holdingTankMeasurement);
      setCurrentHoldingTankMeasurement(clone(holdingTankMeasurement));
      const index = currentHoldingTankMeasurements.findIndex(x => x.holdingTankMeasurementId === holdingTankMeasurementId);
      if (~index) {
       
        // remove the deleted item from the data table data source
        var updatedCurrentHoldingTankMeasurements = clone(currentHoldingTankMeasurements);
        updatedCurrentHoldingTankMeasurements.splice(index, 1);
        setCurrentHoldingTankMeasurements(updatedCurrentHoldingTankMeasurements);
      }
    } 
    catch (err) {
      console.log(err);
      ToastService.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  };

  const onAddHoldingTankMeasurementButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const handleEvent = () => {
      const holdingTankMeasurement = new HoldingTankMeasurementModel();
      holdingTankMeasurement.holdingTankMeasurementId = uuidv4().toLowerCase();
      holdingTankMeasurement.holdingTankId = appContext.holdingTank?.holdingTankId || '';
      reset(holdingTankMeasurement);
      setCurrentHoldingTankMeasurement(clone(holdingTankMeasurement));
      setIsFormEnabled(true);
      setEditingStarted(true);
    };

    if (formState.isDirty) {
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

  const onEditHoldingTankMeasurementClick = (holdingTankMeasurement: HoldingTankMeasurementModel) => {
    const handleEvent = () => {
      fetchHoldingTankMeasurement(holdingTankMeasurement.holdingTankMeasurementId);
      setIsFormEnabled(true);
    };

    if (formState.isDirty) {
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

  const onDeleteHoldingTankMeasurementClick = (holdingTankMeasurement: HoldingTankMeasurementModel) => {
    const handleEvent = () => {
      deleteHoldingTankMeasurement(holdingTankMeasurement.holdingTankMeasurementId);
      setIsFormEnabled(false);
    };

    setDialogTitleText('Confirm Deletion');
    setDialogBodyText(`Delete water measurement for '${holdingTankMeasurement.dateMeasured ? moment(holdingTankMeasurement.dateMeasured).format('YYYY-MM-DD') : ''}'?`);
    setOnDialogYes(() => async () => {
      handleEvent();
      setShowYesNoDialog(false);
    });
    setOnDialogNo(() => () => {
      setShowYesNoDialog(false);
    });
    setShowYesNoDialog(true);
  };

  const onSubmit = handleSubmit(async (modifiedHoldingTankMeasurement: HoldingTankMeasurementModel) => {
    if (!formState.isDirty) return;

    await saveHoldingTankMeasurement(modifiedHoldingTankMeasurement);
    ToastService.success('Record saved');
  });

  const saveHoldingTankMeasurement = async (modifiedHoldingTankMeasurement: HoldingTankMeasurementModel) => {
    try {
      setShowSpinner(true);
      const patchedHoldingTankMeasurement = { ...currentHoldingTankMeasurement, ...modifiedHoldingTankMeasurement };
      await HoldingTankMeasurementService.saveHoldingTankMeasurement(patchedHoldingTankMeasurement);
      reset(patchedHoldingTankMeasurement);
      setCurrentHoldingTankMeasurement(clone(patchedHoldingTankMeasurement));
      const index = currentHoldingTankMeasurements.findIndex(x => x.holdingTankMeasurementId === patchedHoldingTankMeasurement.holdingTankMeasurementId);
      if (~index) {
        currentHoldingTankMeasurements[index] = clone(patchedHoldingTankMeasurement);
      } else {
        currentHoldingTankMeasurements.push(patchedHoldingTankMeasurement);
      }
      setCurrentHoldingTankMeasurements(clone(currentHoldingTankMeasurements));

      ToastService.success('Record saved');
    } 
    catch (err) {
      console.log(err);
      ToastService.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  };

  const onCancelClick = () => {
    reset(clone(currentHoldingTankMeasurements));
  };

  return (
    <Box id='holdingTankMeasurements'>
      <Spinner isActive={showSpinner} />
      <LeaveThisPagePrompt isDirty={formState.isDirty} />
      <YesNoDialog
        isOpen={showYesNoDialog}
        titleText={dialogTitleText}
        bodyText={dialogBodyText}
        onYesClick={onDialogYes}
        onNoClick={onDialogNo}
      />
      <YesNoCancelDialog
        isOpen={showYesNoCancelDialog}
        titleText={dialogTitleText}
        bodyText={dialogBodyText}
        onYesClick={onDialogYes}
        onNoClick={onDialogNo}
        onCancelClick={onDialogCancel}
      />

      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenMobile}>
        <Link to='/'>Home</Link>
        <Link to='/holding-tanks'>Holding Tanks</Link>
        <Typography color='textPrimary'>Water Measurements</Typography>
      </Breadcrumbs>
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenNotMobile}>
        <Link to='/holding-tanks'>&#10094; Holding Tanks</Link>
      </Breadcrumbs>

      <Grid container justifyContent='center'>
        <Grid item xs={12} md={8}>
          <Typography variant='h1' align='center' gutterBottom={true}>Water Measurements for {appContext.holdingTank?.holdingTankName}</Typography>

          <Grid container justifyContent='center' className={classes.formAddButtonsContainer}>
            <Grid item className={classes.formAddButtonContainer}>
              <Button className={classes.fixedWidthLarge} variant='contained' color='primary' type='button' 
                onClick={onAddHoldingTankMeasurementButtonClick} 
                startIcon={<Icon icon='add' />}
              >
                Add Water Measurement
              </Button>
            </Grid>
          </Grid>

          <DisplayTable
            columns={tableColumns}
            data={currentHoldingTankMeasurements}
            defaultSortField="dateMeasured"
            defaultSortAsc={false}
            onRowClicked={row => onEditHoldingTankMeasurementClick(row as HoldingTankMeasurementModel)}
            onDeleteClicked={row => onDeleteHoldingTankMeasurementClick(row as HoldingTankMeasurementModel)}
          />

          <Divider />

          <FormProvider {...methods} >
            <form onSubmit={onSubmit}>
              <fieldset disabled={!isFormEnabled}>
                <FormFieldRow>
                  <DateFormField fieldName='dateMeasured' labelText='Date Measured' validationRules={{ required: 'Date Measured is required' }} refObject={firstEditControlRef} disabled={!isFormEnabled} />
                  <DecimalFormField fieldName='temperature' labelText='Temperature' decimalPlaces={2} disabled={!isFormEnabled} />
                  <DecimalFormField fieldName='salinity' labelText='Salinity (in ppt)' decimalPlaces={2} disabled={!isFormEnabled} />
                  <DecimalFormField fieldName='ph' labelText='pH' decimalPlaces={2} disabled={!isFormEnabled} />
                </FormFieldRow>

                <Box className={classes.formActionButtonsContainer}>
                  <Button className={clsx(classes.fixedWidthMedium, classes.saveButton)} variant='contained' type='submit' disabled={!(formState.isValid && formState.isDirty)}>
                    Save
                  </Button>
                  <Button className={classes.fixedWidthMedium} variant='contained' color='secondary' type='button' onClick={() => onCancelClick()} disabled={!formState.isDirty}>
                    Cancel
                  </Button>
                </Box>
              </fieldset>
            </form>
          </FormProvider>

        </Grid>
      </Grid>
    </Box>
  );
};

export default HoldingTankMeasurements;
