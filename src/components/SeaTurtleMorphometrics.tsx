import { Box, Breadcrumbs, Button, Divider, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import browserHistory from 'browserHistory';
import clsx from 'clsx';
import YesNoCancelDialog from 'components/Dialogs/YesNoCancelDialog';
import YesNoDialog from 'components/Dialogs/YesNoDialog';
import DateFormField from 'components/FormFields/DateFormField';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import ListFormField from 'components/FormFields/ListFormField';
import TextFormField from 'components/FormFields/TextFormField';
import Icon from 'components/Icon';
import LeaveThisPagePrompt from 'components/LeaveThisPagePrompt';
import Spinner from 'components/Spinner/Spinner';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import NameValuePair from 'models/NameValuePair';
import OrganizationModel from 'models/OrganizationModel';
import SeaTurtleMorphometricModel from 'models/SeaTurtleMorphometricModel';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import CodeListTableService, { CodeTableType } from 'services/CodeTableListService';
import OrganizationService from 'services/OrganizationService';
import SeaTurtleMorphometricService from 'services/SeaTurtleMorphometricService';
import ToastService from 'services/ToastService';
import sharedStyles from 'styles/sharedStyles';
import { clone, constants } from 'utils';
import { v4 as uuidv4 } from 'uuid';
import DisplayTable from './DisplayTable';

const SeaTurtleMorphometrics: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(sharedStyles(theme))
  );
  const classes = useStyles();

  const [appContext] = useAppContext();
  const methods = useForm<SeaTurtleMorphometricModel>({ mode: 'onChange', defaultValues: new SeaTurtleMorphometricModel(), shouldUnregister: false });
  const { handleSubmit, formState, reset } = methods;
  const [currentOrganization, setCurrentOrganization] = useState(new OrganizationModel());
  const [currentSeaTurtleMorphometric, setCurrentSeaTurtleMorphometric] = useState(new SeaTurtleMorphometricModel());
  const [currentSeaTurtleMorphometrics, setCurrentSeaTurtleMorphometrics] = useState([] as Array<SeaTurtleMorphometricModel>);
  const [cmIns, setCmIns] = useState([] as Array<NameValuePair>);
  const [kgLbs, setKgLbs] = useState([] as Array<NameValuePair>);
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
      name: 'SCL notch-notch',
      selector: 'sclNotchNotchValue',
      sortable: true,
      right: true,
    },
    {
      name: 'SCL notch-tip',
      selector: 'sclNotchTipValue',
      sortable: true,
      right: true,
    },
    {
      name: 'SCL tip-tip',
      selector: 'sclTipTipValue',
      sortable: true,
      right: true,
    },
    {
      name: 'SCW',
      selector: 'scwValue',
      sortable: true,
      right: true,
    },
    {
      name: 'CCL notch-notch',
      selector: 'cclNotchNotchValue',
      sortable: true,
      right: true,
    },
    {
      name: 'CCL notch-tip',
      selector: 'cclNotchTipValue',
      sortable: true,
      right: true,
    },
    {
      name: 'CCL tip-tip',
      selector: 'cclTipTipValue',
      sortable: true,
      right: true,
    },
    {
      name: 'CCW',
      selector: 'ccwValue',
      sortable: true,
      right: true,
    },
    {
      name: 'Weight',
      selector: 'weightValue',
      sortable: true,
      right: true,
    }
  ], []);
  
  /* scroll to top */
  useMount(() => {
    window.scrollTo(0, 0);
  });

  /* fetch listbox data */
  useMount(() => {
    setCmIns(CodeListTableService.getList(CodeTableType.CmIn, true));
    setKgLbs(CodeListTableService.getList(CodeTableType.KgLb, true));
  });

  /* fetch table data */
  useMount(() => {
    const seaTurtleId = appContext.seaTurtle?.seaTurtleId;
    if (!seaTurtleId) {
      browserHistory.push('/sea-turtles')
    } else {
      const getSeaTurtleMorphometrics = async () => {
        try {
          setShowSpinner(true);
          const seaTurtleMorphometrics = await SeaTurtleMorphometricService.getSeaTurtleMorphometrics(seaTurtleId);
          setCurrentSeaTurtleMorphometrics(seaTurtleMorphometrics);
        }
        catch (err) {
          console.log(err);
          ToastService.error(constants.ERROR.GENERIC);
        }
        finally {
          setShowSpinner(false);
        }
      };
      getSeaTurtleMorphometrics();
    }
  });

  useMount(() => {
    const getOrganization = async () => {
      try {
        setShowSpinner(true);
        const organization = await OrganizationService.getOrganization();
        setCurrentOrganization(organization);
      }
      catch (err) {
        console.log(err);
        ToastService.error(constants.ERROR.GENERIC);
      }
      finally {
        setShowSpinner(false);
      }
    };
    getOrganization();
  });

  useEffect(() => {
    if (editingStarted && firstEditControlRef?.current !== null) {
      firstEditControlRef.current.focus();
    }
    setEditingStarted(false);
  }, [editingStarted]);

  const fetchSeaTurtleMorphometric = async (seaTurtleMorphometricId: string) => {
    try {
      const seaTurtleId = appContext.seaTurtle?.seaTurtleId;
      if (!seaTurtleId) return;
      
      setShowSpinner(true);
      const seaTurtleMorphometric = await SeaTurtleMorphometricService.getSeaTurtleMorphometric(seaTurtleId, seaTurtleMorphometricId);
      reset(seaTurtleMorphometric);
      setCurrentSeaTurtleMorphometric(clone(seaTurtleMorphometric));
    } 
    catch (err) {
      console.log(err);
      ToastService.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  };

  const deleteSeaTurtleMorphometric = async (seaTurtleMorphometricId: string) => {
    const seaTurtleId = appContext.seaTurtle?.seaTurtleId;
    if (!seaTurtleId) return;
    
    try {
      setShowSpinner(true);
      await SeaTurtleMorphometricService.deleteSeaTurtleMorphometric(seaTurtleId, seaTurtleMorphometricId);
      const seaTurtleMorphometric = new SeaTurtleMorphometricModel();
      reset(seaTurtleMorphometric);
      setCurrentSeaTurtleMorphometric(clone(seaTurtleMorphometric));
      const index = currentSeaTurtleMorphometrics.findIndex(x => x.seaTurtleMorphometricId === seaTurtleMorphometricId);
      if (~index) {
        // remove the deleted item from the data table data source
        var updatedCurrentSeaTurtleMorphometrics = clone(currentSeaTurtleMorphometrics);
        updatedCurrentSeaTurtleMorphometrics.splice(index, 1);
        setCurrentSeaTurtleMorphometrics(updatedCurrentSeaTurtleMorphometrics);
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

  const onAddSeaTurtleMorphometricButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const handleEvent = () => {
      const defaultLengthUnits = () => currentOrganization.preferredUnitsType === 'I' ? 'in' : 'cm';
      const defaultWeightUnits = () => currentOrganization.preferredUnitsType === 'I' ? 'lb' : 'kg';
      const seaTurtleMorphometric = new SeaTurtleMorphometricModel();
      seaTurtleMorphometric.seaTurtleMorphometricId = uuidv4().toLowerCase();
      seaTurtleMorphometric.seaTurtleId = appContext.seaTurtle?.seaTurtleId || '';
      seaTurtleMorphometric.sclNotchNotchUnits = defaultLengthUnits();
      seaTurtleMorphometric.sclNotchTipUnits = defaultLengthUnits();
      seaTurtleMorphometric.sclTipTipUnits = defaultLengthUnits();
      seaTurtleMorphometric.scwUnits = defaultLengthUnits();
      seaTurtleMorphometric.cclNotchNotchUnits = defaultLengthUnits();
      seaTurtleMorphometric.cclNotchTipUnits = defaultLengthUnits();
      seaTurtleMorphometric.cclTipTipUnits = defaultLengthUnits();
      seaTurtleMorphometric.ccwUnits = defaultLengthUnits();
      seaTurtleMorphometric.weightUnits = defaultWeightUnits();
      reset(seaTurtleMorphometric);
      setCurrentSeaTurtleMorphometric(clone(seaTurtleMorphometric));
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

  const onEditSeaTurtleMorphometricClick = (seaTurtleMorphometric: SeaTurtleMorphometricModel) => {
    const handleEvent = () => {
      fetchSeaTurtleMorphometric(seaTurtleMorphometric.seaTurtleMorphometricId);
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

  const onDeleteSeaTurtleMorphometricClick = (seaTurtleMorphometric: SeaTurtleMorphometricModel) => {
    const handleEvent = () => {
      deleteSeaTurtleMorphometric(seaTurtleMorphometric.seaTurtleMorphometricId);
      setIsFormEnabled(false);
    };

    setDialogTitleText('Confirm Deletion');
    setDialogBodyText(`Delete morphometric for '${seaTurtleMorphometric.dateMeasured ? moment(seaTurtleMorphometric.dateMeasured).format('YYYY-MM-DD') : ''}'?`);
    setOnDialogYes(() => async () => {
      handleEvent();
      setShowYesNoDialog(false);
    });
    setOnDialogNo(() => () => {
      setShowYesNoDialog(false);
    });
    setShowYesNoDialog(true);
  };

  const onSubmit = handleSubmit(async (modifiedSeaTurtleMorphometric: SeaTurtleMorphometricModel) => {
    if (!formState.isDirty) return;

    await saveSeaTurtleMorphometric(modifiedSeaTurtleMorphometric);
    ToastService.success('Record saved');
  });

  const saveSeaTurtleMorphometric = async (modifiedSeaTurtleMorphometric: SeaTurtleMorphometricModel) => {
    try {
      setShowSpinner(true);
      const patchedSeaTurtleMorphometric = { ...currentSeaTurtleMorphometric, ...modifiedSeaTurtleMorphometric };
      await SeaTurtleMorphometricService.saveSeaTurtleMorphometric(patchedSeaTurtleMorphometric);
      reset(patchedSeaTurtleMorphometric);
      setCurrentSeaTurtleMorphometric(clone(patchedSeaTurtleMorphometric));
      const index = currentSeaTurtleMorphometrics.findIndex(x => x.seaTurtleMorphometricId === patchedSeaTurtleMorphometric.seaTurtleMorphometricId);
      if (~index) {
          currentSeaTurtleMorphometrics[index] = clone(patchedSeaTurtleMorphometric);
      } else {
          currentSeaTurtleMorphometrics.push(patchedSeaTurtleMorphometric);
      }
      setCurrentSeaTurtleMorphometrics(clone(currentSeaTurtleMorphometrics));
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
    reset(clone(currentSeaTurtleMorphometric));
  };

  return (
    <Box id='seaTurtleMorphometrics'>
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
        <Link to='/sea-turtles'>Sea Turtles</Link>
        <Typography color='textPrimary'>Morphometric Measurements</Typography>
      </Breadcrumbs>
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenNotMobile}>
        <Link to='/sea-turtles'>&#10094; Sea Turtles</Link>
      </Breadcrumbs>

      <Grid container justifyContent='center'>
        <Grid item xs={12} md={8}>
          <Typography variant='h1' align='center' gutterBottom={true}>Morphometrics for {appContext.seaTurtle?.seaTurtleName}</Typography>

          <Grid container justifyContent='center' className={classes.formAddButtonsContainer}>
            <Grid item className={classes.formAddButtonContainer}>
              <Button className={classes.fixedWidthLarge} variant='contained' color='primary' type='button' 
                onClick={onAddSeaTurtleMorphometricButtonClick} 
                startIcon={<Icon icon='add' />}
              >
                Add Morphometric
              </Button>
            </Grid>
          </Grid>

          <DisplayTable
            columns={tableColumns}
            data={currentSeaTurtleMorphometrics}
            defaultSortField="dateMeasured"
            defaultSortAsc={false}
            onRowClicked={row => onEditSeaTurtleMorphometricClick(row as SeaTurtleMorphometricModel)}
            onDeleteClicked={row => onDeleteSeaTurtleMorphometricClick(row as SeaTurtleMorphometricModel)}
          />

          <Divider />

          <FormProvider {...methods} >
            <form onSubmit={onSubmit}>
              <fieldset disabled={!isFormEnabled}>
                <FormFieldRow>
                  <DateFormField fieldName='dateMeasured' labelText='Date Measured' validationRules={{ required: 'Date Measured is required' }} refObject={firstEditControlRef} disabled={!isFormEnabled} />
                </FormFieldRow>
                <FormFieldRow>
                  <TextFormField fieldName='sclNotchNotchValue' labelText='SCL notch-notch' disabled={!isFormEnabled} />
                  <ListFormField fieldName='sclNotchNotchUnits' labelText='Units' listItems={cmIns} disabled={!isFormEnabled} />
                  <TextFormField fieldName='sclNotchTipValue' labelText='SCL notch-tip' disabled={!isFormEnabled} />
                  <ListFormField fieldName='sclNotchTipUnits' labelText='Units' listItems={cmIns} disabled={!isFormEnabled} />
                  <TextFormField fieldName='sclTipTipValue' labelText='SCL tip-tip' disabled={!isFormEnabled} />
                  <ListFormField fieldName='sclTipTipUnits' labelText='Units' listItems={cmIns} disabled={!isFormEnabled} />
                  <TextFormField fieldName='scwValue' labelText='SCW' disabled={!isFormEnabled} />
                  <ListFormField fieldName='scwUnits' labelText='Units' listItems={cmIns} disabled={!isFormEnabled} />
                </FormFieldRow>
                <FormFieldRow>
                  <TextFormField fieldName='cclNotchNotchValue' labelText='CCL notch-notch' disabled={!isFormEnabled} />
                  <ListFormField fieldName='cclNotchNotchUnits' labelText='Units' listItems={cmIns} disabled={!isFormEnabled} />
                  <TextFormField fieldName='cclNotchTipValue' labelText='CCL notch-tip' disabled={!isFormEnabled} />
                  <ListFormField fieldName='cclNotchTipUnits' labelText='Units' listItems={cmIns} disabled={!isFormEnabled} />
                  <TextFormField fieldName='cclTipTipValue' labelText='CCL tip-tip' disabled={!isFormEnabled} />
                  <ListFormField fieldName='cclTipTipUnits' labelText='Units' listItems={cmIns} disabled={!isFormEnabled} />
                  <TextFormField fieldName='ccwValue' labelText='CCW' disabled={!isFormEnabled} />
                  <ListFormField fieldName='ccwUnits' labelText='Units' listItems={cmIns} disabled={!isFormEnabled} />
                </FormFieldRow>
                <FormFieldRow>
                  <TextFormField fieldName='weightValue' labelText='Weight' disabled={!isFormEnabled} />
                  <ListFormField fieldName='weightUnits' labelText='Units' listItems={kgLbs} disabled={!isFormEnabled} />
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

export default SeaTurtleMorphometrics;
