import { Box, Breadcrumbs, Button, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import browserHistory from 'browserHistory';
import clsx from 'clsx';
import YesNoCancelDialog from 'components/Dialogs/YesNoCancelDialog';
import YesNoDialog from 'components/Dialogs/YesNoDialog';
import DateFormField from 'components/FormFields/DateFormField';
import FormFieldRowMui from 'components/FormFields/FormFieldRow';
import ListFormField from 'components/FormFields/ListFormField';
import TextFormField from 'components/FormFields/TextFormField';
import Icon from 'components/Icon';
import LeaveThisPagePrompt from 'components/LeaveThisPagePrompt';
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
  const methods = useForm<SeaTurtleMorphometricModel>({ mode: 'onChange', defaultValues: new SeaTurtleMorphometricModel() });
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
  const tableRef = useRef<any>(null);

  const [tableColumns] = useState([
    {
      title: 'Date Measured',
      field: 'dateMeasured',
      render: (rowData: SeaTurtleMorphometricModel) => <span>{rowData.dateMeasured ? moment(rowData.dateMeasured).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: 'SCL notch-notch',
      field: 'sclNotchNotchValue',
      render: (rowData: SeaTurtleMorphometricModel) => <div style={{textAlign: 'right'}}><span>{rowData.sclNotchNotchValue}</span></div>,
    },
    {
      title: 'SCL notch-tip',
      field: 'sclNotchTipValue',
      render: (rowData: SeaTurtleMorphometricModel) => <div style={{textAlign: 'right'}}><span>{rowData.sclNotchTipValue}</span></div>,
    },
    {
      title: 'SCL tip-tip',
      field: 'sclTipTipValue',
      render: (rowData: SeaTurtleMorphometricModel) => <div style={{textAlign: 'right'}}><span>{rowData.sclTipTipValue}</span></div>,
    },
    {
      title: 'SCW',
      field: 'scwValue',
      render: (rowData: SeaTurtleMorphometricModel) => <div style={{textAlign: 'right'}}><span>{rowData.scwValue}</span></div>,
    },
    {
      title: 'CCL notch-notch',
      field: 'cclNotchNotchValue',
      render: (rowData: SeaTurtleMorphometricModel) => <div style={{textAlign: 'right'}}><span>{rowData.cclNotchNotchValue}</span></div>,
    },
    {
      title: 'CCL notch-tip',
      field: 'cclNotchTipValue',
      render: (rowData: SeaTurtleMorphometricModel) => <div style={{textAlign: 'right'}}><span>{rowData.cclNotchTipValue}</span></div>,
    },
    {
      title: 'CCL tip-tip',
      field: 'cclTipTipValue',
      render: (rowData: SeaTurtleMorphometricModel) => <div style={{textAlign: 'right'}}><span>{rowData.cclTipTipValue}</span></div>,
    },
    {
      title: 'CCW',
      field: 'ccwValue',
      render: (rowData: SeaTurtleMorphometricModel) => <div style={{textAlign: 'right'}}><span>{rowData.ccwValue}</span></div>,
    },
    {
      title: 'Weight',
      field: 'weightValue',
      render: (rowData: SeaTurtleMorphometricModel) => <div style={{textAlign: 'right'}}><span>{rowData.weightValue}</span></div>,
    }
  ]);

  
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
      const seaTurtleMorphometric = new SeaTurtleMorphometricModel();
      reset(seaTurtleMorphometric);
      setCurrentSeaTurtleMorphometric(seaTurtleMorphometric);
      const index = currentSeaTurtleMorphometrics.findIndex(x => x.seaTurtleMorphometricId === seaTurtleMorphometricId);
      if (~index) {
        // if we are deleting the last item on the page, 
        // "go back" one page to account for MaterialTable bug
        const dataManager = tableRef.current.dataManager;
        const numberOfItemsDisplayedInCurrentPage = dataManager.searchedData.length % dataManager.pageSize;
        if (numberOfItemsDisplayedInCurrentPage === 1 && dataManager.currentPage > 0) {
          dataManager.changeCurrentPage(dataManager.currentPage - 1);
        }
        
        // remove the deleted item from the data table data source
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
      setCurrentSeaTurtleMorphometric(seaTurtleMorphometric);
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

  const onEditSeaTurtleMorphometricClick = (seaTurtleMorphometric: SeaTurtleMorphometricModel) => {
    const handleEvent = () => {
      fetchSeaTurtleMorphometric(seaTurtleMorphometric.seaTurtleMorphometricId);
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
    if (!formState.dirty) return;

    await saveSeaTurtleMorphometric(modifiedSeaTurtleMorphometric);
    ToastService.success('Record saved');
  });

  const saveSeaTurtleMorphometric = async (modifiedSeaTurtleMorphometric: SeaTurtleMorphometricModel) => {
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
    reset(currentSeaTurtleMorphometric);
  };

  return (
    <Box id='seaTurtleMorphometrics'>
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
                startIcon={<Icon icon='add' />}
              >
                Add Morphometric
              </Button>
            </Grid>
          </Grid>

          <Box className={classes.dataTableContainer}>
            <MaterialTable tableRef={tableRef}
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
          </Box>
          <hr />

          <FormContext {...methods} >
            <form onSubmit={onSubmit}>
              <fieldset disabled={!isFormEnabled}>
                <FormFieldRowMui>
                  <DateFormField fieldName='dateMeasured' labelText='Date Measured' validationOptions={{ required: 'Date Measured is required' }} refObject={firstEditControlRef} disabled={!isFormEnabled} />
                </FormFieldRowMui>
                <FormFieldRowMui>
                  <TextFormField fieldName='sclNotchNotchValue' labelText='SCL notch-notch' disabled={!isFormEnabled} />
                  <ListFormField fieldName='sclNotchNotchUnits' labelText='Units' listItems={cmIns} disabled={!isFormEnabled} />
                  <TextFormField fieldName='sclNotchTipValue' labelText='SCL notch-tip' disabled={!isFormEnabled} />
                  <ListFormField fieldName='sclNotchTipUnits' labelText='Units' listItems={cmIns} disabled={!isFormEnabled} />
                  <TextFormField fieldName='sclTipTipValue' labelText='SCL tip-tip' disabled={!isFormEnabled} />
                  <ListFormField fieldName='sclTipTipUnits' labelText='Units' listItems={cmIns} disabled={!isFormEnabled} />
                  <TextFormField fieldName='scwValue' labelText='SCW' disabled={!isFormEnabled} />
                  <ListFormField fieldName='scwUnits' labelText='Units' listItems={cmIns} disabled={!isFormEnabled} />
                </FormFieldRowMui>
                <FormFieldRowMui>
                  <TextFormField fieldName='cclNotchNotchValue' labelText='CCL notch-notch' disabled={!isFormEnabled} />
                  <ListFormField fieldName='cclNotchNotchUnits' labelText='Units' listItems={cmIns} disabled={!isFormEnabled} />
                  <TextFormField fieldName='cclNotchTipValue' labelText='CCL notch-tip' disabled={!isFormEnabled} />
                  <ListFormField fieldName='cclNotchTipUnits' labelText='Units' listItems={cmIns} disabled={!isFormEnabled} />
                  <TextFormField fieldName='cclTipTipValue' labelText='CCL tip-tip' disabled={!isFormEnabled} />
                  <ListFormField fieldName='cclTipTipUnits' labelText='Units' listItems={cmIns} disabled={!isFormEnabled} />
                  <TextFormField fieldName='ccwValue' labelText='CCW' disabled={!isFormEnabled} />
                  <ListFormField fieldName='ccwUnits' labelText='Units' listItems={cmIns} disabled={!isFormEnabled} />
                </FormFieldRowMui>
                <FormFieldRowMui>
                  <TextFormField fieldName='weightValue' labelText='Weight' disabled={!isFormEnabled} />
                  <ListFormField fieldName='weightUnits' labelText='Units' listItems={kgLbs} disabled={!isFormEnabled} />
                </FormFieldRowMui>

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

export default SeaTurtleMorphometrics;
