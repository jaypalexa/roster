import { Breadcrumbs, Button, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import browserHistory from 'browserHistory';
import clsx from 'clsx';
import YesNoCancelDialog from 'components/Dialogs/YesNoCancelDialog';
import YesNoDialog from 'components/Dialogs/YesNoDialog';
import DateFormFieldMui from 'components/FormFields/DateFormFieldMui';
import FormFieldRowMui from 'components/FormFields/FormFieldRowMui';
import ListFormFieldMui from 'components/FormFields/ListFormFieldMui';
import TextFormFieldMui from 'components/FormFields/TextFormFieldMui';
import IconMui from 'components/Icon/IconMui';
import LeaveThisPagePrompt from 'components/LeaveThisPagePrompt/LeaveThisPagePrompt';
import Spinner from 'components/Spinner/Spinner';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import MaterialTable from 'material-table';
import NameValuePair from 'models/NameValuePair';
import OrganizationModel from 'models/OrganizationModel';
import SeaTurtleMorphometricModel from 'models/SeaTurtleMorphometricModel';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import CodeListTableService, { CodeTableType } from 'services/CodeTableListService';
import OrganizationService from 'services/OrganizationService';
import SeaTurtleMorphometricService from 'services/SeaTurtleMorphometricService';
import ToastService from 'services/ToastService';
import sharedStyles from 'styles/sharedStyles';
import { actionIcons, constants, tableIcons } from 'utils';
import { v4 as uuidv4 } from 'uuid';

const SeaTurtleMorphometrics: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles({...sharedStyles(theme)})
  );
  const classes = useStyles();

  const [appContext] = useAppContext();
  const methods = useForm<SeaTurtleMorphometricModel>({ mode: 'onChange' });
  const { handleSubmit, formState, reset } = methods;
  const [currentOrganization, setCurrentOrganization] = useState({} as OrganizationModel);
  const [currentSeaTurtleMorphometric, setCurrentSeaTurtleMorphometric] = useState({} as SeaTurtleMorphometricModel);
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

  const [tableColumns] = useState([
    {
      title: 'Date Measured',
      field: 'dateMeasured',
      render: (rowData: SeaTurtleMorphometricModel) => <span>{rowData.dateMeasured ? moment(rowData.dateMeasured).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: 'SCL notch-notch',
      field: 'sclNotchNotchValue',
    },
    {
      title: 'SCL notch-tip',
      field: 'sclNotchTipValue',
    },
    {
      title: 'SCL tip-tip',
      field: 'sclTipTipValue',
    },
    {
      title: 'SCW',
      field: 'scwValue',
    },
    {
      title: 'CCL notch-notch',
      field: 'cclNotchNotchValue',
    },
    {
      title: 'CCL notch-tip',
      field: 'cclNotchTipValue',
    },
    {
      title: 'CCL tip-tip',
      field: 'cclTipTipValue',
    },
    {
      title: 'CCW',
      field: 'ccwValue',
    },
    {
      title: 'Weight',
      field: 'weightValue',
    }
  ]);

  useMount(() => {
    setCmIns(CodeListTableService.getList(CodeTableType.CmIn, true));
    setKgLbs(CodeListTableService.getList(CodeTableType.KgLb, true));
  });

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
    const fetchOrganization = async () => {
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
    fetchOrganization();
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
      setCurrentSeaTurtleMorphometric(seaTurtleMorphometric);
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
      const seaTurtleMorphometric = {} as SeaTurtleMorphometricModel;
      reset(seaTurtleMorphometric);
      setCurrentSeaTurtleMorphometric(seaTurtleMorphometric);
      const index = currentSeaTurtleMorphometrics.findIndex(x => x.seaTurtleMorphometricId === seaTurtleMorphometricId);
      if (~index) {
        var updatedCurrentSeaTurtleMorphometrics = [...currentSeaTurtleMorphometrics];
        updatedCurrentSeaTurtleMorphometrics.splice(index, 1)
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
      const seaTurtleMorphometric = {} as SeaTurtleMorphometricModel;
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
      setCurrentSeaTurtleMorphometric(seaTurtleMorphometric);
      setIsFormEnabled(true);
      setEditingStarted(true);
    };

    if (formState.dirty) {
      setDialogTitleText('Unsaved Changes');
      setDialogBodyText('Save changes?');
      setOnDialogYes(() => async () => {
        await onSubmitSeaTurtleMorphometric();
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

    if (formState.dirty) {
      setDialogTitleText('Unsaved Changes');
      setDialogBodyText('Save changes?');
      setOnDialogYes(() => async () => {
        await onSubmitSeaTurtleMorphometric();
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

  const onSubmitSeaTurtleMorphometric = handleSubmit(async (modifiedSeaTurtleMorphometric: SeaTurtleMorphometricModel) => {
    try {
      setShowSpinner(true);
      const patchedSeaTurtleMorphometric = { ...currentSeaTurtleMorphometric, ...modifiedSeaTurtleMorphometric };
      await SeaTurtleMorphometricService.saveSeaTurtleMorphometric(patchedSeaTurtleMorphometric);
      reset(patchedSeaTurtleMorphometric);
      setCurrentSeaTurtleMorphometric(patchedSeaTurtleMorphometric);
      const index = currentSeaTurtleMorphometrics.findIndex(x => x.seaTurtleMorphometricId === patchedSeaTurtleMorphometric.seaTurtleMorphometricId);
    if (~index) {
        currentSeaTurtleMorphometrics[index] = { ...patchedSeaTurtleMorphometric };
    } else {
        currentSeaTurtleMorphometrics.push(patchedSeaTurtleMorphometric);
    }
      setCurrentSeaTurtleMorphometrics([...currentSeaTurtleMorphometrics]);

    ToastService.success('Record saved');
    } 
    catch (err) {
      console.log(err);
      ToastService.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  });

  const onCancelClick = () => {
    reset(currentSeaTurtleMorphometric);
  };

  return (
    <div id='seaTurtleMorphometrics'>
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
        <Link to='/sea-turtles'>Sea Turtles</Link>
        <Typography color='textPrimary'>Morphometric Measurements</Typography>
      </Breadcrumbs>
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenNotMobile}>
        <Link to='/sea-turtles'>&#10094; Sea Turtles</Link>
      </Breadcrumbs>

      <Grid container justify='center'>
        <Grid item xs={12} md={8}>
          <Typography variant='h1' align='center'>Morphometrics for {appContext.seaTurtle?.seaTurtleName}</Typography>

          <Grid container justify='center' className={classes.formAddButtonsContainer}>
            <Grid item className={classes.formAddButtonContainer}>
              <Button className={classes.fixedWidthLarge} variant='contained' color='primary' type='button' 
                onClick={onAddSeaTurtleMorphometricButtonClick} 
                startIcon={<IconMui icon='add' />}
              >
                Add Morphometric
              </Button>
            </Grid>
          </Grid>

          <div className={classes.horizontalScroll}>
            <MaterialTable
              icons={tableIcons}
              columns={tableColumns} 
              data={[...currentSeaTurtleMorphometrics]}
              options={{filtering: true, showTitle: false}}
              onRowClick={(event, data) => onEditSeaTurtleMorphometricClick(data as SeaTurtleMorphometricModel)}
              actions={[
                {
                  icon: actionIcons.EditIcon,
                  tooltip: 'Edit',
                  onClick: (event, data) => onEditSeaTurtleMorphometricClick(data as SeaTurtleMorphometricModel)
                },
                {
                  icon: actionIcons.DeleteIcon,
                  tooltip: 'Delete',
                  onClick: (event, data) => onDeleteSeaTurtleMorphometricClick(data as SeaTurtleMorphometricModel)
                },
              ]}
            />
          </div>
          <hr />

          <FormContext {...methods} >
            <form onSubmit={onSubmitSeaTurtleMorphometric}>
              <fieldset disabled={!isFormEnabled}>
                <FormFieldRowMui>
                  <DateFormFieldMui fieldName='dateMeasured' labelText='Date Measured' validationOptions={{ required: 'Date Measured is required' }} refObject={firstEditControlRef} />
                </FormFieldRowMui>
                <FormFieldRowMui>
                  <TextFormFieldMui fieldName='sclNotchNotchValue' labelText='SCL notch-notch' />
                  <ListFormFieldMui fieldName='sclNotchNotchUnits' labelText='Units' listItems={cmIns} />
                  <TextFormFieldMui fieldName='sclNotchTipValue' labelText='SCL notch-tip' />
                  <ListFormFieldMui fieldName='sclNotchTipUnits' labelText='Units' listItems={cmIns} />
                  <TextFormFieldMui fieldName='sclTipTipValue' labelText='SCL tip-tip' />
                  <ListFormFieldMui fieldName='sclTipTipUnits' labelText='Units' listItems={cmIns} />
                  <TextFormFieldMui fieldName='scwValue' labelText='SCW' />
                  <ListFormFieldMui fieldName='scwUnits' labelText='Units' listItems={cmIns} />
                </FormFieldRowMui>
                <FormFieldRowMui>
                  <TextFormFieldMui fieldName='cclNotchNotchValue' labelText='CCL notch-notch' />
                  <ListFormFieldMui fieldName='cclNotchNotchUnits' labelText='Units' listItems={cmIns} />
                  <TextFormFieldMui fieldName='cclNotchTipValue' labelText='CCL notch-tip' />
                  <ListFormFieldMui fieldName='cclNotchTipUnits' labelText='Units' listItems={cmIns} />
                  <TextFormFieldMui fieldName='cclTipTipValue' labelText='CCL tip-tip' />
                  <ListFormFieldMui fieldName='cclTipTipUnits' labelText='Units' listItems={cmIns} />
                  <TextFormFieldMui fieldName='ccwValue' labelText='CCW' />
                  <ListFormFieldMui fieldName='ccwUnits' labelText='Units' listItems={cmIns} />
                </FormFieldRowMui>
                <FormFieldRowMui>
                  <TextFormFieldMui fieldName='weightValue' labelText='Weight' />
                  <ListFormFieldMui fieldName='weightUnits' labelText='Units' listItems={kgLbs} />
                </FormFieldRowMui>

                <div className={classes.formActionButtonsContainer}>
                  <Button className={clsx(classes.fixedWidthMedium, classes.saveButton)} variant='contained' type='submit' disabled={!(formState.isValid && formState.dirty)}>
                    Save
                  </Button>
                  <Button className={classes.fixedWidthMedium} variant='contained' color='secondary' type='button' onClick={() => onCancelClick()} disabled={!formState.dirty}>
                    Cancel
                  </Button>
                </div>
              </fieldset>
            </form>
          </FormContext>

        </Grid>
      </Grid>
    </div>
  );
};

export default SeaTurtleMorphometrics;
