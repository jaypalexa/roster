import { Box, Breadcrumbs, Button, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import browserHistory from 'browserHistory';
import clsx from 'clsx';
import ChildNavigation from 'components/ChildNavigation/ChildNavigation';
import MapDialog from 'components/Dialogs/MapDialog';
import YesNoCancelDialog from 'components/Dialogs/YesNoCancelDialog';
import YesNoDialog from 'components/Dialogs/YesNoDialog';
import CheckboxFormFieldMui from 'components/FormFields/CheckboxFormFieldMui';
import DateFormFieldMui from 'components/FormFields/DateFormFieldMui';
import FormFieldGroup from 'components/FormFields/FormFieldGroup';
import FormFieldMui from 'components/FormFields/FormFieldMui';
import FormFieldRowMui from 'components/FormFields/FormFieldRowMui';
import ListFormFieldMui from 'components/FormFields/ListFormFieldMui';
import TextareaFormFieldMui from 'components/FormFields/TextareaFormFieldMui';
import TextFormFieldMui from 'components/FormFields/TextFormFieldMui';
import IconMui from 'components/Icon/IconMui';
import LeaveThisPagePrompt from 'components/LeaveThisPagePrompt/LeaveThisPagePrompt';
import Spinner from 'components/Spinner/Spinner';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import MaterialTable from 'material-table';
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
import './SeaTurtles.sass';

const SeaTurtles: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles({...sharedStyles(theme)})
  );
  const classes = useStyles();

  const [appContext, setAppContext] = useAppContext();
  const methods = useForm<SeaTurtleModel>({ mode: 'onChange', defaultValues: new SeaTurtleModel() });
  const { handleSubmit, formState, getValues, reset } = methods;
  const [currentSeaTurtleListItems, setCurrentSeaTurtleListItems] = useState([] as Array<SeaTurtleListItemModel>);
  const [filteredSeaTurtleListItems, setFilteredSeaTurtleListItems] = useState([] as Array<SeaTurtleListItemModel>);
  const [mapData, setMapData] = useState({} as MapDataModel);
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
        setFilteredSeaTurtleListItems(seaTurtleListItems.filter(x => !x.dateRelinquished));
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

  const resetDisplaySeaTurtleListItems = (isChecked: boolean) => {
    setShowSpinner(true);
    if (isChecked) {
      setFilteredSeaTurtleListItems([...currentSeaTurtleListItems]);
    } else {
      setFilteredSeaTurtleListItems(currentSeaTurtleListItems.filter(x => !x.dateRelinquished));
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

  const deleteSeaTurtle = (seaTurtleId: string) => {
    try {
      setShowSpinner(true);
      const deleteSeaTurtle = async () => {
        await SeaTurtleService.deleteSeaTurtle(seaTurtleId);
        const seaTurtle = {} as SeaTurtleModel;
        reset(seaTurtle);
        setCurrentSeaTurtle(seaTurtle);
        const index = currentSeaTurtleListItems.findIndex(x => x.seaTurtleId === seaTurtleId);
        if (~index) {
          var updatedCurrentSeaTurtleListItems = [...currentSeaTurtleListItems];
          updatedCurrentSeaTurtleListItems.splice(index, 1)
          setCurrentSeaTurtleListItems(updatedCurrentSeaTurtleListItems);
        }
        resetDisplaySeaTurtleListItems(isCheckedShowRelinquishedTurtles);
      };
      deleteSeaTurtle();
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
      console.log('seaTurtle', seaTurtle);
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
    setOnDialogYes(() => async () => {
      handleEvent();
      setShowYesNoDialog(false);
    });
    setOnDialogNo(() => () => {
      setShowYesNoDialog(false);
    });
    setShowYesNoDialog(true);
  };

  const onSubmit = handleSubmit((modifiedSeaTurtle: SeaTurtleModel) => {
    saveSeaTurtle(modifiedSeaTurtle);
    ToastService.success('Record saved');
  });

  const saveSeaTurtle = async (modifiedSeaTurtle: SeaTurtleModel) => {
    if (!formState.dirty) return;

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
      resetDisplaySeaTurtleListItems(isCheckedShowRelinquishedTurtles);
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
    const modifiedSeaTurtle: SeaTurtleModel = getValues();
    await saveSeaTurtle(modifiedSeaTurtle);
    setTimeout(() => {
      browserHistory.push(linkTo);
    }, 0);
  }

  const onCancelClick = () => {
    reset(appContext.seaTurtle);
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

  const onShowRelinquishedTurtlesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetDisplaySeaTurtleListItems(!isCheckedShowRelinquishedTurtles);
    setIsCheckedShowRelinquishedTurtles(!isCheckedShowRelinquishedTurtles);
    setAppContext({ ...appContext, isCheckedShowRelinquishedTurtles: !isCheckedShowRelinquishedTurtles });
  };

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
                startIcon={<IconMui icon='add' />}
              >
                Add Sea Turtle
              </Button>
            </Grid>
          </Grid>
          
          <Box className={classes.horizontalScroll}>
            <MaterialTable
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
            />
          </Box>
          <Box className='field show-relinquished-turtles'>
            <input 
              id='showRelinquishedTurtles'
              name='showRelinquishedTurtles' 
              className='switch is-success'
              type='checkbox'
              onChange={onShowRelinquishedTurtlesChange}
              checked={isCheckedShowRelinquishedTurtles}
            />
            <label htmlFor='showRelinquishedTurtles'>Show relinquished turtles?</label>
          </Box>

          <hr />

          <Typography variant='h1' gutterBottom={true} align='center'>
            {appContext.seaTurtle?.seaTurtleName}
          </Typography>

          <FormContext {...methods}>
            <form onSubmit={onSubmit}>
              <fieldset disabled={!isFormEnabled}>
                <Typography variant='h2' gutterBottom={true}>General Information</Typography>

                <FormFieldRowMui>
                  <TextFormFieldMui fieldName='seaTurtleName' labelText='Name' refObject={firstEditControlRef} disabled={!isFormEnabled} />
                  <TextFormFieldMui fieldName='sidNumber' labelText='SID number' disabled={!isFormEnabled} />
                  <TextFormFieldMui fieldName='strandingIdNumber' labelText='Stranding ID number' disabled={!isFormEnabled} />
                </FormFieldRowMui>
                <FormFieldRowMui>
                  <ListFormFieldMui fieldName='species' labelText='Species' listItems={species} disabled={!isFormEnabled} />
                  <ListFormFieldMui fieldName='turtleSize' labelText='Size' listItems={turtleSizes} disabled={!isFormEnabled} />
                  <ListFormFieldMui fieldName='status' labelText='Status' listItems={turtleStatuses} disabled={!isFormEnabled} />
                </FormFieldRowMui>
                <FormFieldRowMui>
                  <DateFormFieldMui fieldName='dateAcquired' labelText='Date acquired' disabled={!isFormEnabled} />
                  <TextFormFieldMui fieldName='acquiredFrom' labelText='Acquired from' disabled={!isFormEnabled} />
                  <ListFormFieldMui fieldName='acquiredCounty' labelText='County' listItems={counties} disabled={!isFormEnabled} />
                  <TextFormFieldMui fieldName='acquiredLatitude' labelText='Latitude' disabled={!isFormEnabled} />
                  <TextFormFieldMui fieldName='acquiredLongitude' labelText='Longitude' disabled={!isFormEnabled} />
                  <FormFieldMui fieldName='dummy'>
                    <Button variant='contained' color='primary' type='button' disabled={!isFormEnabled}
                      onClick={onShowMapDialogClick('Acquired')} 
                      startIcon={<IconMui icon='map' />} 
                      className={clsx(classes.fixedWidthMedium, classes.textTransformNone, classes.whiteSpaceNoWrap)}
                    >
                      View on map
                    </Button>
                  </FormFieldMui>
                </FormFieldRowMui>
                <FormFieldRowMui>
                  <DateFormFieldMui fieldName='dateRelinquished' labelText='Date relinquished' disabled={!isFormEnabled} />
                  <TextFormFieldMui fieldName='relinquishedTo' labelText='Relinquished to' disabled={!isFormEnabled} />
                  <ListFormFieldMui fieldName='relinquishedCounty' labelText='County' listItems={counties} disabled={!isFormEnabled} />
                  <TextFormFieldMui fieldName='relinquishedLatitude' labelText='Latitude' disabled={!isFormEnabled} />
                  <TextFormFieldMui fieldName='relinquishedLongitude' labelText='Longitude' disabled={!isFormEnabled} />
                  <FormFieldMui fieldName='dummy'>
                    <Button variant='contained' color='primary' type='button' disabled={!isFormEnabled}
                      onClick={onShowMapDialogClick('Relinquished')} 
                      startIcon={<IconMui icon='map' />} 
                      className={clsx(classes.fixedWidthMedium, classes.textTransformNone, classes.whiteSpaceNoWrap)}
                    >
                      View on map
                    </Button>
                  </FormFieldMui>
                </FormFieldRowMui>
                <FormFieldRowMui>
                  <TextareaFormFieldMui fieldName='anomalies' labelText='Anomalies' rows={4} disabled={!isFormEnabled} />
                  <FormFieldGroup fieldClass='checkbox-group checkboxes-5' labelText='Injuries'>
                    <CheckboxFormFieldMui fieldName='injuryBoatStrike' labelText='Boat/Propeller strike' disabled={!isFormEnabled} />
                    <CheckboxFormFieldMui fieldName='injuryIntestinalImpaction' labelText='Intestinal impaction' disabled={!isFormEnabled} />
                    <CheckboxFormFieldMui fieldName='injuryLineEntanglement' labelText='Line/net entanglement' disabled={!isFormEnabled} />
                    <CheckboxFormFieldMui fieldName='injuryFishHook' labelText='Fish hook' disabled={!isFormEnabled} />
                    <CheckboxFormFieldMui fieldName='injuryUpperRespiratory' labelText='Upper respiratory' disabled={!isFormEnabled} />
                    <CheckboxFormFieldMui fieldName='injuryAnimalBite' labelText='Animal bite' disabled={!isFormEnabled} />
                    <CheckboxFormFieldMui fieldName='injuryFibropapilloma' labelText='Fibropapilloma' disabled={!isFormEnabled} />
                    <CheckboxFormFieldMui fieldName='injuryMiscEpidemic' labelText='Misc. epidemic' disabled={!isFormEnabled} />
                    <CheckboxFormFieldMui fieldName='injuryDoa' labelText='DOA' disabled={!isFormEnabled} />
                    <CheckboxFormFieldMui fieldName='injuryOther' labelText='Other' disabled={!isFormEnabled} />
                  </FormFieldGroup>
                </FormFieldRowMui>
                <hr />

                <Typography variant='h2' gutterBottom={true}>Initial Encounter Information</Typography>
                <FormFieldRowMui>
                  <FormFieldGroup fieldClass='checkbox-group checkboxes-1' labelText='Initial encounter'>
                    <CheckboxFormFieldMui fieldName='wasCarryingTagsWhenEnc' labelText='Was turtle carrying tags when initially encountered?' disabled={!isFormEnabled} />
                  </FormFieldGroup>
                  <ListFormFieldMui fieldName='recaptureType' labelText='If yes, recapture type' listItems={recaptureTypes} disabled={!isFormEnabled} />
                  <TextFormFieldMui fieldName='tagReturnAddress' labelText='Tag return address' disabled={!isFormEnabled} />
                </FormFieldRowMui>
                <FormFieldRowMui>
                  <ListFormFieldMui fieldName='captureProjectType' labelText='Project type' listItems={captureProjectTypes} disabled={!isFormEnabled} />
                  <ListFormFieldMui fieldName='didTurtleNest' labelText='If "Nesting Beach," did turtle nest?' listItems={yesNoUndetermineds} disabled={!isFormEnabled} />
                  <TextFormFieldMui fieldName='captureProjectOther' labelText='If "Other," describe' disabled={!isFormEnabled} />
                </FormFieldRowMui>
                <hr />

                <Typography variant='h2' gutterBottom={true}>Inspected and/or Scanned For</Typography>
                <FormFieldRowMui>
                  <FormFieldGroup fieldClass='checkbox-group checkboxes-1' labelText='Inspected for'>
                    <CheckboxFormFieldMui fieldName='inspectedForTagScars' labelText='Tag scars' disabled={!isFormEnabled} />
                  </FormFieldGroup>
                  <TextFormFieldMui fieldName='tagScarsLocated' labelText='Located?' disabled={!isFormEnabled} />
                  <FormFieldGroup fieldClass='checkbox-group checkboxes-1' labelText='Scanned for'>
                    <CheckboxFormFieldMui fieldName='scannedForPitTags' labelText='PIT tags'  disabled={!isFormEnabled}/>
                  </FormFieldGroup>
                  <TextFormFieldMui fieldName='pitTagsScanFrequency' labelText='Frequency?' disabled={!isFormEnabled} />
                </FormFieldRowMui>
                <FormFieldRowMui>
                  <FormFieldGroup fieldClass='checkbox-group checkboxes-1' labelText='Scanned for'>
                    <CheckboxFormFieldMui fieldName='scannedForMagneticWires' labelText='Magnetic wires' disabled={!isFormEnabled} />
                  </FormFieldGroup>
                  <TextFormFieldMui fieldName='magneticWiresLocated' labelText='Located?' disabled={!isFormEnabled} />
                  <FormFieldGroup fieldClass='checkbox-group checkboxes-1' labelText='Inspected for'>
                    <CheckboxFormFieldMui fieldName='inspectedForLivingTags' labelText='Living tags' disabled={!isFormEnabled} />
                  </FormFieldGroup>
                  <TextFormFieldMui fieldName='livingTagsLocated' labelText='Located?' disabled={!isFormEnabled} />
                </FormFieldRowMui>
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
