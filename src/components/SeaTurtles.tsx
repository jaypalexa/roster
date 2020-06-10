import { Box, Breadcrumbs, Button, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import browserHistory from 'browserHistory';
import clsx from 'clsx';
import ChildNavigation from 'components/ChildNavigation';
import MapDialog from 'components/Dialogs/MapDialog';
import YesNoCancelDialog from 'components/Dialogs/YesNoCancelDialog';
import YesNoDialog from 'components/Dialogs/YesNoDialog';
import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import CheckboxGroupFormField from 'components/FormFields/CheckboxGroupFormField';
import DateFormField from 'components/FormFields/DateFormField';
import FormField from 'components/FormFields/FormField';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import ListFormField from 'components/FormFields/ListFormField';
import TextareaFormField from 'components/FormFields/TextareaFormField';
import TextFormField from 'components/FormFields/TextFormField';
import Icon from 'components/Icon';
import LeaveThisPagePrompt from 'components/LeaveThisPagePrompt';
import Spinner from 'components/Spinner/Spinner';
import ToggleSwitch from 'components/ToggleSwitch';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import MaterialTable, { MTableToolbar } from 'material-table';
import MapDataModel from 'models/MapDataModel';
import NameValuePair from 'models/NameValuePair';
import SeaTurtleListItemModel from 'models/SeaTurtleListItemModel';
import SeaTurtleModel from 'models/SeaTurtleModel';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import AuthenticationService from 'services/AuthenticationService';
import CodeListTableService, { CodeTableType } from 'services/CodeTableListService';
import SeaTurtleService from 'services/SeaTurtleService';
import ToastService from 'services/ToastService';
import sharedStyles from 'styles/sharedStyles';
import { actionIcons, constants, tableIcons } from 'utils';
import { v4 as uuidv4 } from 'uuid';

const SeaTurtles: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(sharedStyles(theme))
  );
  const classes = useStyles();

  const [appContext, setAppContext] = useAppContext();
  const methods = useForm<SeaTurtleModel>({ mode: 'onChange', defaultValues: new SeaTurtleModel() });
  const { handleSubmit, formState, getValues, reset } = methods;
  const [currentSeaTurtleListItems, setCurrentSeaTurtleListItems] = useState([] as Array<SeaTurtleListItemModel>);
  const [filteredSeaTurtleListItems, setFilteredSeaTurtleListItems] = useState([] as Array<SeaTurtleListItemModel>);
  const [mapData, setMapData] = useState(new MapDataModel());
  const [captureProjectTypes, setCaptureProjectTypes] = useState([] as Array<NameValuePair>);
  const [counties, setCounties] = useState([] as Array<NameValuePair>);
  const [species, setSpecies] = useState([] as Array<NameValuePair>);
  const [recaptureTypes, setRecaptureTypes] = useState([] as Array<NameValuePair>);
  const [turtleSizes, setTurtleSizes] = useState([] as Array<NameValuePair>);
  const [turtleStatuses, setTurtleStatuses] = useState([] as Array<NameValuePair>);
  const [yesNoUndetermineds, setYesNoUndetermineds] = useState([] as Array<NameValuePair>);
  const [isFormEnabled, setIsFormEnabled] = useState(false);
  const [showYesNoCancelDialog, setShowYesNoCancelDialog] = useState(false);
  const [showYesNoDialog, setShowYesNoDialog] = useState(false);
  const [dialogTitleText, setDialogTitleText] = useState('');
  const [dialogBodyText, setDialogBodyText] = useState('');
  const [onDialogYes, setOnDialogYes] = useState<((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined>(() => {});
  const [onDialogNo, setOnDialogNo] = useState<((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined>(() => {});
  const [onDialogCancel, setOnDialogCancel] = useState<((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined>(() => {});
  const [editingStarted, setEditingStarted] = useState(false);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [isCheckedShowRelinquishedTurtles, setIsCheckedShowRelinquishedTurtles] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const firstEditControlRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<any>(null);

  const [tableColumns] = useState([
    {
      title: 'Name',
      field: 'seaTurtleName',
      defaultSort: 'asc' as 'asc'
    },
    {
      title: 'SID #',
      field: 'sidNumber',
    },
    {
      title: 'Species',
      field: 'species',
    },
    {
      title: 'Date Acquired',
      field: 'dateAcquired',
      render: (rowData: SeaTurtleListItemModel) => <span>{rowData.dateAcquired ? moment(rowData.dateAcquired).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: 'County',
      field: 'acquiredCounty',
    },
    {
      title: 'Size',
      field: 'turtleSize',
    },
    {
      title: 'Status',
      field: 'status',
    },
    {
      title: 'Date Relinquished',
      selector: 'dateRelinquished',
      render: (rowData: SeaTurtleListItemModel) => <span>{rowData.dateRelinquished ? moment(rowData.dateRelinquished).format('YYYY-MM-DD') : ''}</span>,
    }
  ]);

  /* scroll to top */
  useMount(() => {
    window.scrollTo(0, 0);
  });

  /* fetch listbox data */
  useMount(() => {
    setCaptureProjectTypes(CodeListTableService.getList(CodeTableType.CaptureProjectType, true));
    setCounties(CodeListTableService.getList(CodeTableType.County, true));
    setRecaptureTypes(CodeListTableService.getList(CodeTableType.RecaptureType, true));
    setSpecies(CodeListTableService.getList(CodeTableType.Species, true));
    setTurtleSizes(CodeListTableService.getList(CodeTableType.TurtleSize, true));
    setTurtleStatuses(CodeListTableService.getList(CodeTableType.TurtleStatus, true));
    setYesNoUndetermineds(CodeListTableService.getList(CodeTableType.YesNoUndetermined, true));
  });

  /* fetch table data */
  useMount(() => {
    const getSeaTurtleListItems = async () => {
      try {
        setShowSpinner(true);
        const seaTurtleListItems = await SeaTurtleService.getSeaTurtleListItemsForTable();
        setCurrentSeaTurtleListItems(seaTurtleListItems);
        resetFilteredSeaTurtleListItems(seaTurtleListItems, appContext.isCheckedShowRelinquishedTurtles);
        if (appContext.seaTurtle?.seaTurtleId && appContext.seaTurtle?.organizationId === AuthenticationService.getOrganizationId()) {
          reset(appContext.seaTurtle);
          setCurrentSeaTurtle(appContext.seaTurtle);
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
    getSeaTurtleListItems();
  });

  /* reset previous setting of options */
  useMount(() => {
    setIsCheckedShowRelinquishedTurtles(appContext.isCheckedShowRelinquishedTurtles);
  });

  useEffect(() => {
    if (editingStarted && firstEditControlRef?.current !== null) {
      firstEditControlRef.current.focus();
    }
    setEditingStarted(false);
  }, [editingStarted]);

  const resetFilteredSeaTurtleListItems = (seaTurtleListItems: SeaTurtleListItemModel[], isChecked: boolean) => {
    setShowSpinner(true);
    if (isChecked) {
      setFilteredSeaTurtleListItems([...seaTurtleListItems]);
    } else {
      setFilteredSeaTurtleListItems(seaTurtleListItems.filter(x => !x.dateRelinquished));
    }
    setShowSpinner(false);
  };

  const setCurrentSeaTurtle = (seaTurtle: SeaTurtleModel) => {
    setAppContext({ ...appContext, seaTurtle: seaTurtle });
  }

  const fetchSeaTurtle = async (seaTurtleId: string) => {
    try {
      setShowSpinner(true);
      const seaTurtle = await SeaTurtleService.getSeaTurtle(seaTurtleId);
      reset(seaTurtle);
      setCurrentSeaTurtle(seaTurtle);
    } 
    catch (err) {
      console.log(err);
      ToastService.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  };

  const deleteSeaTurtle = async (seaTurtleId: string) => {
    try {
      setShowSpinner(true);
      await SeaTurtleService.deleteSeaTurtle(seaTurtleId);
      const seaTurtle = new SeaTurtleModel();
      reset(seaTurtle);
      setCurrentSeaTurtle(seaTurtle);
      const index = currentSeaTurtleListItems.findIndex(x => x.seaTurtleId === seaTurtleId);
      if (~index) {
        // if we are deleting the last item on the page, 
        // "go back" one page to account for MaterialTable bug
        const dataManager = tableRef.current.dataManager;
        const numberOfItemsDisplayedInCurrentPage = dataManager.searchedData.length % dataManager.pageSize;
        if (numberOfItemsDisplayedInCurrentPage === 1 && dataManager.currentPage > 0) {
          dataManager.changeCurrentPage(dataManager.currentPage - 1);
        }
        
        // remove the deleted item from the data table data source
        var updatedCurrentSeaTurtleListItems = [...currentSeaTurtleListItems];
        updatedCurrentSeaTurtleListItems.splice(index, 1)
        setCurrentSeaTurtleListItems(updatedCurrentSeaTurtleListItems);
        resetFilteredSeaTurtleListItems(updatedCurrentSeaTurtleListItems, isCheckedShowRelinquishedTurtles);
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

  const onAddSeaTurtleButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const handleEvent = () => {
      const seaTurtle = new SeaTurtleModel();
      seaTurtle.seaTurtleId = uuidv4().toLowerCase();
      reset(seaTurtle);
      setCurrentSeaTurtle(seaTurtle);
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

  const onEditSeaTurtleClick = (seaTurtleListItem: SeaTurtleListItemModel) => {
    const handleEvent = () => {
      fetchSeaTurtle(seaTurtleListItem.seaTurtleId);
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

  const onDeleteSeaTurtleClick = (seaTurtleListItem: SeaTurtleListItemModel) => {
    const handleEvent = () => {
      deleteSeaTurtle(seaTurtleListItem.seaTurtleId);
      setIsFormEnabled(false);
    };

    setDialogTitleText('Confirm Deletion');
    setDialogBodyText(`Delete turtle '${seaTurtleListItem.seaTurtleName || seaTurtleListItem.sidNumber}'?`);
    setOnDialogYes(() => () => {
      handleEvent();
      setShowYesNoDialog(false);
    });
    setOnDialogNo(() => () => {
      setShowYesNoDialog(false);
    });
    setShowYesNoDialog(true);
  };

  const onSubmit = handleSubmit(async (modifiedSeaTurtle: SeaTurtleModel) => {
    if (!formState.dirty) return;

    await saveSeaTurtle(modifiedSeaTurtle);
    ToastService.success('Record saved');
  });

  const saveSeaTurtle = async (modifiedSeaTurtle: SeaTurtleModel) => {
    try {
      setShowSpinner(true);
      const patchedSeaTurtle = { ...appContext.seaTurtle, ...modifiedSeaTurtle };
      await SeaTurtleService.saveSeaTurtle(patchedSeaTurtle);
      reset(patchedSeaTurtle);
      setCurrentSeaTurtle(patchedSeaTurtle);
      const index = currentSeaTurtleListItems.findIndex(x => x.seaTurtleId === patchedSeaTurtle.seaTurtleId);
      if (~index) {
        currentSeaTurtleListItems[index] = { ...patchedSeaTurtle as SeaTurtleListItemModel };
      } else {
        currentSeaTurtleListItems.push(patchedSeaTurtle as SeaTurtleListItemModel);
      }
      setCurrentSeaTurtleListItems([...currentSeaTurtleListItems]);
      resetFilteredSeaTurtleListItems([...currentSeaTurtleListItems], isCheckedShowRelinquishedTurtles);
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
    reset(appContext.seaTurtle);
  };

  const onShowRelinquishedTurtlesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetFilteredSeaTurtleListItems(currentSeaTurtleListItems, !isCheckedShowRelinquishedTurtles);
    setIsCheckedShowRelinquishedTurtles(!isCheckedShowRelinquishedTurtles);
    setAppContext({ ...appContext, isCheckedShowRelinquishedTurtles: !isCheckedShowRelinquishedTurtles });
  };

  const onShowMapDialogClick = (dataType: string) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const modifiedSeaTurtle: SeaTurtleModel = getValues();
    const data = {} as MapDataModel;
    // data.center = { latitude: 28.681389, longitude: -82.46, description: 'Geographic center of Florida' };
    data.center = { latitude: 27.25, longitude: -83.25, description: 'Better visual center of Florida (ish)' };
    data.initialZoom = 6;
    const latitude = modifiedSeaTurtle[`${dataType.toLowerCase()}Latitude`] as number;
    const longitude = modifiedSeaTurtle[`${dataType.toLowerCase()}Longitude`] as number;
    if (latitude && longitude) {
      data.markers = [{ latitude, longitude, description: modifiedSeaTurtle.seaTurtleName || modifiedSeaTurtle.sidNumber }];
      data.subtitle = `Lat: ${latitude} | Lon: ${longitude}`;
    }
    data.title = `${dataType} Location for ${modifiedSeaTurtle.seaTurtleName || modifiedSeaTurtle.sidNumber}`;
    setMapData(data);
    setIsMapDialogOpen(true);
  };

  const onChildNavigationClick = async (linkTo: string) => {
    const modifiedSeaTurtle: SeaTurtleModel = getValues();
    await saveSeaTurtle(modifiedSeaTurtle);
    setTimeout(() => {
      browserHistory.push(linkTo);
    }, 0);
  }

  return (
    <Box id='seaTurtle'>
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

      <MapDialog 
        isOpen={isMapDialogOpen} 
        mapData={mapData} 
        onCloseClick={() => setIsMapDialogOpen(false)} 
      />

      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenMobile}>
        <Link to='/'>Home</Link>
        <Typography color='textPrimary'>Sea Turtles</Typography>
      </Breadcrumbs>
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenNotMobile}>
        <Link to='/'>&#10094; Home</Link>
      </Breadcrumbs>

      <Grid container justify='center'>
        <Grid item xs={12} md={8}>
          <Typography variant='h1' align='center'>Sea Turtles</Typography>

          <Grid container justify='center' className={classes.formAddButtonsContainer}>
            <Grid item className={classes.formAddButtonContainer}>
              <Button className={classes.fixedWidthLarge} variant='contained' color='primary' type='button' 
                onClick={onAddSeaTurtleButtonClick} 
                startIcon={<Icon icon='add' />}
              >
                Add Sea Turtle
              </Button>
            </Grid>
          </Grid>
          
          <Box className={classes.dataTableContainer}>
            <MaterialTable tableRef={tableRef}
              icons={tableIcons}
              columns={tableColumns}
              data={[...filteredSeaTurtleListItems]}
              options={{filtering: true, showTitle: false}}
              onRowClick={(event, data) => onEditSeaTurtleClick(data as SeaTurtleListItemModel)}
              actions={[
                {
                  icon: actionIcons.EditIcon,
                  tooltip: 'Edit',
                  onClick: (event, data) => onEditSeaTurtleClick(data as SeaTurtleListItemModel)
                },
                {
                  icon: actionIcons.DeleteIcon,
                  tooltip: 'Delete',
                  onClick: (event, data) => onDeleteSeaTurtleClick(data as SeaTurtleListItemModel)
                },
              ]}
              components={{
                Toolbar: props => (
                  <div>
                    <MTableToolbar {...props} />
                    <div style={{padding: '0px 10px'}}>
                      <ToggleSwitch 
                        name='showRelinquishedTurtles' 
                        labelText='Show relinquished turtles?'
                        checked={isCheckedShowRelinquishedTurtles}
                        onChange={onShowRelinquishedTurtlesChange}
                      />
                    </div>
                  </div>
                ),
              }}
            />
          </Box>
          <hr />

          <Typography variant='h1' gutterBottom={true} align='center'>
            {appContext.seaTurtle?.seaTurtleName}
          </Typography>

          <FormContext {...methods}>
            <form onSubmit={onSubmit}>
              <fieldset disabled={!isFormEnabled}>
                <Typography variant='h2' gutterBottom={true}>General Information</Typography>

                <FormFieldRow>
                  <TextFormField fieldName='seaTurtleName' labelText='Name' refObject={firstEditControlRef} disabled={!isFormEnabled} />
                  <TextFormField fieldName='sidNumber' labelText='SID number' disabled={!isFormEnabled} />
                  <TextFormField fieldName='strandingIdNumber' labelText='Stranding ID number' disabled={!isFormEnabled} />
                </FormFieldRow>
                <FormFieldRow>
                  <ListFormField fieldName='species' labelText='Species' listItems={species} disabled={!isFormEnabled} />
                  <ListFormField fieldName='turtleSize' labelText='Size' listItems={turtleSizes} disabled={!isFormEnabled} />
                  <ListFormField fieldName='status' labelText='Status' listItems={turtleStatuses} disabled={!isFormEnabled} />
                </FormFieldRow>
                <FormFieldRow>
                  <DateFormField fieldName='dateAcquired' labelText='Date acquired' disabled={!isFormEnabled} />
                  <TextFormField fieldName='acquiredFrom' labelText='Acquired from' disabled={!isFormEnabled} />
                  <ListFormField fieldName='acquiredCounty' labelText='County' listItems={counties} disabled={!isFormEnabled} />
                  <TextFormField fieldName='acquiredLatitude' labelText='Latitude' disabled={!isFormEnabled} />
                  <TextFormField fieldName='acquiredLongitude' labelText='Longitude' disabled={!isFormEnabled} />
                  <FormField fieldName='dummy'>
                    <Button variant='contained' color='primary' type='button' disabled={!isFormEnabled}
                      onClick={onShowMapDialogClick('Acquired')} 
                      startIcon={<Icon icon='map' />} 
                      className={clsx(classes.fixedWidthMedium, classes.textTransformNone, classes.whiteSpaceNoWrap)}
                    >
                      View on map
                    </Button>
                  </FormField>
                </FormFieldRow>
                <FormFieldRow>
                  <DateFormField fieldName='dateRelinquished' labelText='Date relinquished' disabled={!isFormEnabled} />
                  <TextFormField fieldName='relinquishedTo' labelText='Relinquished to' disabled={!isFormEnabled} />
                  <ListFormField fieldName='relinquishedCounty' labelText='County' listItems={counties} disabled={!isFormEnabled} />
                  <TextFormField fieldName='relinquishedLatitude' labelText='Latitude' disabled={!isFormEnabled} />
                  <TextFormField fieldName='relinquishedLongitude' labelText='Longitude' disabled={!isFormEnabled} />
                  <FormField fieldName='dummy'>
                    <Button variant='contained' color='primary' type='button' disabled={!isFormEnabled}
                      onClick={onShowMapDialogClick('Relinquished')} 
                      startIcon={<Icon icon='map' />} 
                      className={clsx(classes.fixedWidthMedium, classes.textTransformNone, classes.whiteSpaceNoWrap)}
                    >
                      View on map
                    </Button>
                  </FormField>
                </FormFieldRow>
                <FormFieldRow>
                  <TextareaFormField fieldName='anomalies' labelText='Anomalies' rows={4} disabled={!isFormEnabled} />
                  <CheckboxGroupFormField labelText='Injuries' itemsPerColumn={5}>
                    <CheckboxFormField fieldName='injuryBoatStrike' labelText='Boat/Propeller strike' disabled={!isFormEnabled} />
                    <CheckboxFormField fieldName='injuryIntestinalImpaction' labelText='Intestinal impaction' disabled={!isFormEnabled} />
                    <CheckboxFormField fieldName='injuryLineEntanglement' labelText='Line/net entanglement' disabled={!isFormEnabled} />
                    <CheckboxFormField fieldName='injuryFishHook' labelText='Fish hook' disabled={!isFormEnabled} />
                    <CheckboxFormField fieldName='injuryUpperRespiratory' labelText='Upper respiratory' disabled={!isFormEnabled} />
                    <CheckboxFormField fieldName='injuryAnimalBite' labelText='Animal bite' disabled={!isFormEnabled} />
                    <CheckboxFormField fieldName='injuryFibropapilloma' labelText='Fibropapilloma' disabled={!isFormEnabled} />
                    <CheckboxFormField fieldName='injuryMiscEpidemic' labelText='Misc. epidemic' disabled={!isFormEnabled} />
                    <CheckboxFormField fieldName='injuryDoa' labelText='DOA' disabled={!isFormEnabled} />
                    <CheckboxFormField fieldName='injuryOther' labelText='Other' disabled={!isFormEnabled} />
                  </CheckboxGroupFormField>
                </FormFieldRow>
                <hr />

                <Typography variant='h2' gutterBottom={true}>Initial Encounter Information</Typography>
                <FormFieldRow>
                  <CheckboxGroupFormField labelText='Initial encounter' itemsPerColumn={1}>
                    <CheckboxFormField fieldName='wasCarryingTagsWhenEnc' labelText='Was turtle carrying tags when initially encountered?' disabled={!isFormEnabled} />
                  </CheckboxGroupFormField>
                  <ListFormField fieldName='recaptureType' labelText='If yes, recapture type' listItems={recaptureTypes} disabled={!isFormEnabled} />
                  <TextFormField fieldName='tagReturnAddress' labelText='Tag return address' disabled={!isFormEnabled} />
                </FormFieldRow>
                <FormFieldRow>
                  <ListFormField fieldName='captureProjectType' labelText='Project type' listItems={captureProjectTypes} disabled={!isFormEnabled} />
                  <ListFormField fieldName='didTurtleNest' labelText='If "Nesting Beach," did turtle nest?' listItems={yesNoUndetermineds} disabled={!isFormEnabled} />
                  <TextFormField fieldName='captureProjectOther' labelText='If "Other," describe' disabled={!isFormEnabled} />
                </FormFieldRow>
                <hr />

                <Typography variant='h2' gutterBottom={true}>Inspected and/or Scanned For</Typography>
                <FormFieldRow>
                  <CheckboxGroupFormField labelText='Inspected for' itemsPerColumn={1}>
                    <CheckboxFormField fieldName='inspectedForTagScars' labelText='Tag scars' disabled={!isFormEnabled} />
                  </CheckboxGroupFormField>
                  <TextFormField fieldName='tagScarsLocated' labelText='Located?' disabled={!isFormEnabled} />
                  <CheckboxGroupFormField labelText='Scanned for' itemsPerColumn={1}>
                    <CheckboxFormField fieldName='scannedForPitTags' labelText='PIT tags'  disabled={!isFormEnabled}/>
                  </CheckboxGroupFormField>
                  <TextFormField fieldName='pitTagsScanFrequency' labelText='Frequency?' disabled={!isFormEnabled} />
                </FormFieldRow>
                <FormFieldRow>
                  <CheckboxGroupFormField labelText='Scanned for' itemsPerColumn={1}>
                    <CheckboxFormField fieldName='scannedForMagneticWires' labelText='Magnetic wires' disabled={!isFormEnabled} />
                  </CheckboxGroupFormField>
                  <TextFormField fieldName='magneticWiresLocated' labelText='Located?' disabled={!isFormEnabled} />
                  <CheckboxGroupFormField labelText='Inspected for' itemsPerColumn={1}>
                    <CheckboxFormField fieldName='inspectedForLivingTags' labelText='Living tags' disabled={!isFormEnabled} />
                  </CheckboxGroupFormField>
                  <TextFormField fieldName='livingTagsLocated' labelText='Located?' disabled={!isFormEnabled} />
                </FormFieldRow>
                <hr />

                <ChildNavigation itemName='Tags' 
                  disabled={!isFormEnabled} 
                  onClick={() => onChildNavigationClick('/sea-turtle-tags')} />

                <ChildNavigation itemName='Morphometrics Measurements' 
                  disabled={!isFormEnabled} 
                  onClick={() => onChildNavigationClick('/sea-turtle-morphometrics')} />

                <ChildNavigation itemName='Morphometrics Graphs' 
                  disabled={!isFormEnabled} 
                  onClick={() => onChildNavigationClick('/sea-turtle-morphometrics-graphs')} />

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

export default SeaTurtles;
