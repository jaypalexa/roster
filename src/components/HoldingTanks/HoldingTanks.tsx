import { Box, Breadcrumbs, Button, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import browserHistory from 'browserHistory';
import clsx from 'clsx';
import ChildNavigation from 'components/ChildNavigation/ChildNavigation';
import YesNoCancelDialog from 'components/Dialogs/YesNoCancelDialog';
import YesNoDialog from 'components/Dialogs/YesNoDialog';
import FormFieldRowMui from 'components/FormFields/FormFieldRowMui';
import TextFormFieldMui from 'components/FormFields/TextFormFieldMui';
import IconMui from 'components/Icon/IconMui';
import LeaveThisPagePrompt from 'components/LeaveThisPagePrompt/LeaveThisPagePrompt';
import Spinner from 'components/Spinner/Spinner';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import MaterialTable from 'material-table';
import HoldingTankModel from 'models/HoldingTankModel';
import React, { useEffect, useRef, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import AuthenticationService from 'services/AuthenticationService';
import HoldingTankService from 'services/HoldingTankService';
import ToastService from 'services/ToastService';
import sharedStyles from 'styles/sharedStyles';
import { actionIcons, constants, tableIcons } from 'utils';
import { v4 as uuidv4 } from 'uuid';

const HoldingTanksMui: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles({...sharedStyles(theme)})
  );
  const classes = useStyles();

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

  const [tableColumns] = useState([
    {
      title: 'Name',
      field: 'holdingTankName',
      defaultSort: 'asc' as 'asc'
    },
  ]);

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
        ToastService.error(constants.ERROR.GENERIC);
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
      ToastService.error(constants.ERROR.GENERIC);
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
      ToastService.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  };

  const onAddHoldingTankButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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

  const onSubmit = handleSubmit(async (modifiedHoldingTank: HoldingTankModel) => {
    await saveHoldingTank(modifiedHoldingTank);
    ToastService.success('Record saved');
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
      ToastService.error(constants.ERROR.GENERIC);
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

  const onCancelClick = () => {
    reset(appContext.holdingTank);
  };

  return (
    <Box id='holdingTank'>
      <Spinner isActive={showSpinner} />
      <LeaveThisPagePrompt isDirty={formState.dirty} />
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
        <Typography color='textPrimary'>Holding Tanks</Typography>
      </Breadcrumbs>
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenNotMobile}>
        <Link to='/'>&#10094; Home</Link>
      </Breadcrumbs>

      <Grid container justify='center'>
        <Grid item xs={12} md={8}>
          <Typography variant='h1' align='center'>Holding Tanks</Typography>

          <Grid container justify='center' className={classes.formAddButtonsContainer}>
            <Grid item className={classes.formAddButtonContainer}>
              <Button className={classes.fixedWidthLarge} variant='contained' color='primary' type='button' 
                onClick={onAddHoldingTankButtonClick} 
                startIcon={<IconMui icon='add' />}
              >
                Add Holding Tank
              </Button>
            </Grid>
          </Grid>

          <Box className={classes.dataTableContainer}>
            <MaterialTable
              icons={tableIcons}
              columns={tableColumns}
              data={[...currentHoldingTanks]}
              options={{filtering: true, showTitle: false}}
              onRowClick={(event, data) => onEditHoldingTankClick(data as HoldingTankModel)}
              actions={[
                {
                  icon: actionIcons.EditIcon,
                  tooltip: 'Edit',
                  onClick: (event, data) => onEditHoldingTankClick(data as HoldingTankModel)
                },
                {
                  icon: actionIcons.DeleteIcon,
                  tooltip: 'Delete',
                  onClick: (event, data) => onDeleteHoldingTankClick(data as HoldingTankModel)
                },
              ]}
            />
          </Box>
          <hr />

          <Typography variant='h1' gutterBottom={true} align='center'>
            {appContext.holdingTank?.holdingTankName}
          </Typography>

          <FormContext {...methods} >
            <form onSubmit={onSubmit}>
              <fieldset disabled={!isFormEnabled}>
                <Typography variant='h2'>General Information</Typography>
                <FormFieldRowMui>
                  <TextFormFieldMui fieldName='holdingTankName' labelText='Name' validationOptions={{ required: 'Name is required' }} refObject={firstEditControlRef} disabled={!isFormEnabled} />
                </FormFieldRowMui>
                <hr />

                <ChildNavigation itemName='Water Measurements' 
                  disabled={!isFormEnabled} 
                  onClick={() => onChildNavigationClick('/holding-tank-measurements')} />

                <ChildNavigation itemName='Water Graphs' 
                  disabled={!isFormEnabled} 
                  onClick={() => onChildNavigationClick('/holding-tank-graphs')} />

                <Box className={classes.formActionButtonsContainer}>
                  <Button className={clsx(classes.fixedWidthMedium, classes.saveButton)} variant='contained' type='submit' disabled={!(formState.isValid && formState.dirty)}>
                    Save
                  </Button>
                  <Button className={classes.fixedWidthMedium} variant='contained' color='secondary' type='button' onClick={() => onCancelClick()} disabled={!formState.dirty}>
                    Cancel
                  </Button>
                </Box>
              </fieldset>
            </form>
          </FormContext>
          
        </Grid>
      </Grid>
    </Box>
  );
};

export default HoldingTanksMui;
