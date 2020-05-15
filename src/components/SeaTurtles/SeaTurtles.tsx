import browserHistory from 'browserHistory';
import ChildNavigation from 'components/ChildNavigation/ChildNavigation';
import MapDialog from 'components/Dialogs/MapDialog';
import YesNoCancelDialog from 'components/Dialogs/YesNoCancelDialog';
import YesNoDialog from 'components/Dialogs/YesNoDialog';
import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import DateFormField from 'components/FormFields/DateFormField';
import FormField from 'components/FormFields/FormField';
import FormFieldGroup from 'components/FormFields/FormFieldGroup';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import ListFormField from 'components/FormFields/ListFormField';
import TextareaFormField from 'components/FormFields/TextareaFormField';
import TextFormField from 'components/FormFields/TextFormField';
import LeaveThisPagePrompt from 'components/LeaveThisPagePrompt/LeaveThisPagePrompt';
import Spinner from 'components/Spinner/Spinner';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import MapDataModel from 'models/MapDataModel';
import NameValuePair from 'models/NameValuePair';
import SeaTurtleModel from 'models/SeaTurtleModel';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import CodeListTableService, { CodeTableType } from 'services/CodeTableListService';
import SeaTurtleService from 'services/SeaTurtleService';
import { constants } from 'utils';
import { v4 as uuidv4 } from 'uuid';
import './SeaTurtles.sass';

const SeaTurtles: React.FC = () => {

  const [appContext, setAppContext] = useAppContext();
  const methods = useForm<SeaTurtleModel>({ mode: 'onChange' });
  const { handleSubmit, formState, getValues, reset } = methods;
  const [currentSeaTurtles, setCurrentSeaTurtles] = useState([] as Array<SeaTurtleModel>);
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
  const [showSpinner, setShowSpinner] = useState(false);
  const firstEditControlRef = useRef<HTMLInputElement>(null);

  const tableColumns = [
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      style: '{padding-left: 1rem}',
      cell: (row: SeaTurtleModel) => <span className='icon cursor-pointer' onClick={(event) => { onEditSeaTurtleClick(row, event) }}><i className='fa fa-pencil fa-lg' title='Edit'></i></span>,
    },
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      cell: (row: SeaTurtleModel) => <span className='icon cursor-pointer' onClick={(event) => { onDeleteSeaTurtleClick(row, event) }}><i className='fa fa-trash fa-lg' title='Delete'></i></span>,
    },
    {
      name: 'Name',
      selector: 'seaTurtleName',
      sortable: true
    },
    {
      name: 'SID #',
      selector: 'sidNumber',
      sortable: true
    },
    {
      name: 'Species',
      selector: 'species',
      sortable: true,
      hide: 599
    },
    {
      name: 'Date Acquired',
      selector: (row: SeaTurtleModel) => row.dateAcquired ? moment(row.dateAcquired).format('YYYY-MM-DD') : '',
      sortable: true,
      hide: 599
    },
    {
      name: 'County',
      selector: 'acquiredCounty',
      sortable: true,
      hide: 599
    },
    {
      name: 'Size',
      selector: 'turtleSize',
      sortable: true,
      hide: 599
    },
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      hide: 599
    },
    {
      name: 'Date Relinquished',
      selector: (row: SeaTurtleModel) => row.dateRelinquished ? moment(row.dateRelinquished).format('YYYY-MM-DD') : '',
      sortable: true,
      hide: 599
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
    setCaptureProjectTypes(CodeListTableService.getList(CodeTableType.CaptureProjectType, true));
    setCounties(CodeListTableService.getList(CodeTableType.County, true));
    setRecaptureTypes(CodeListTableService.getList(CodeTableType.RecaptureType, true));
    setSpecies(CodeListTableService.getList(CodeTableType.Species, true));
    setTurtleSizes(CodeListTableService.getList(CodeTableType.TurtleSize, true));
    setTurtleStatuses(CodeListTableService.getList(CodeTableType.TurtleStatus, true));
    setYesNoUndetermineds(CodeListTableService.getList(CodeTableType.YesNoUndetermined, true));
  });

  useMount(() => {
    const getSeaTurtles = async () => {
      try {
        setShowSpinner(true);
        const seaTurtles = await SeaTurtleService.getSeaTurtles();
        setCurrentSeaTurtles(seaTurtles);
        if (appContext.seaTurtle?.seaTurtleId) {
          reset(appContext.seaTurtle);
          setCurrentSeaTurtle(appContext.seaTurtle);
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
    getSeaTurtles();
  });

  useEffect(() => {
    if (editingStarted && firstEditControlRef?.current !== null) {
      firstEditControlRef.current.focus();
    }
    setEditingStarted(false);
  }, [editingStarted]);

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
      toast.error(constants.ERROR.GENERIC);
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
        const index = currentSeaTurtles.findIndex(x => x.seaTurtleId === seaTurtleId);
        if (~index) {
          var updatedCurrentSeaTurtles = [...currentSeaTurtles];
          updatedCurrentSeaTurtles.splice(index, 1)
          setCurrentSeaTurtles(updatedCurrentSeaTurtles);
        }
      };
      deleteSeaTurtle();
    } 
    catch (err) {
      console.log(err);
      toast.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  };

  const onAddSeaTurtleButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const handleEvent = () => {
      const seaTurtle = {} as SeaTurtleModel;
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

  const onEditSeaTurtleClick = (seaTurtle: SeaTurtleModel, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const handleEvent = () => {
      fetchSeaTurtle(seaTurtle.seaTurtleId);
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

  const onDeleteSeaTurtleClick = (seaTurtle: SeaTurtleModel, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const handleEvent = () => {
      deleteSeaTurtle(seaTurtle.seaTurtleId);
      setIsFormEnabled(false);
    };

    setDialogTitleText('Confirm Deletion');
    setDialogBodyText(`Delete turtle '${seaTurtle.seaTurtleName || seaTurtle.sidNumber}' ?`);
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
    toast.success('Record saved');
  });

  const saveSeaTurtle = async (modifiedSeaTurtle: SeaTurtleModel) => {
    if (!formState.dirty) return;

    try {
      setShowSpinner(true);
      const patchedSeaTurtle = { ...appContext.seaTurtle, ...modifiedSeaTurtle };
      await SeaTurtleService.saveSeaTurtle(patchedSeaTurtle);
      reset(patchedSeaTurtle);
      setCurrentSeaTurtle(patchedSeaTurtle);
      const index = currentSeaTurtles.findIndex(x => x.seaTurtleId === patchedSeaTurtle.seaTurtleId);
      if (~index) {
        currentSeaTurtles[index] = { ...patchedSeaTurtle };
      } else {
        currentSeaTurtles.push(patchedSeaTurtle);
      }
      setCurrentSeaTurtles([...currentSeaTurtles]);
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
    const modifiedSeaTurtle: SeaTurtleModel = getValues();
    await saveSeaTurtle(modifiedSeaTurtle);
    setTimeout(() => {
      browserHistory.push(linkTo);
    }, 0);
  }

  const onCancel = () => {
    reset(appContext.seaTurtle);
  };

  const onShowMapDialogClick = (dataType: string) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const modifiedSeaTurtle: SeaTurtleModel = getValues();
    const data = {} as MapDataModel;
    // data.center = { latitude: 28.681389, longitude: -82.46, description: 'Geographic center of Florida' };
    data.center = { latitude: 27.25, longitude: -83.25, description: 'Center of Florida (ish)' };
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

  return (
    <div id='seaTurtle'>
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
      <MapDialog 
        isActive={isMapDialogOpen} 
        mapData={mapData} 
        onCloseClick={() => setIsMapDialogOpen(false)} 
      />
      <nav className='breadcrumb shown-when-not-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li className='is-active'><a href='/#' aria-current='page'>Sea Turtles</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb shown-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>&#10094; Home</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>Sea Turtles</h1>
          <div className='level'>
            <div className='level-left'></div>
            <div className='level-right'>
              <p className='level-item'>
                <button className='button is-link' onClick={onAddSeaTurtleButtonClick}>
                  <span className='icon'>
                    <i className='fa fa-plus'></i>
                  </span>
                  &nbsp;&nbsp;&nbsp;Add Sea Turtle
                </button>
              </p>
            </div>
          </div>

          <DataTable
            title='Sea Turtles'
            columns={tableColumns}
            data={currentSeaTurtles}
            keyField='seaTurtleId'
            defaultSortField='seaTurtleName'
            noHeader={true}
            fixedHeader={true}
            fixedHeaderScrollHeight='9rem'
            customStyles={tableCustomStyles}
          />

          <hr />

          <h1 className='title has-text-centered'>{appContext.seaTurtle?.seaTurtleName || appContext.seaTurtle?.sidNumber}</h1>

          <FormContext {...methods}>
            <form onSubmit={onSubmit}>
              <fieldset disabled={!isFormEnabled}>
                <h2 className='subtitle'>General Information</h2>
                <FormFieldRow>
                  <TextFormField fieldName='seaTurtleName' labelText='Name' refObject={firstEditControlRef} />
                  <TextFormField fieldName='sidNumber' labelText='SID number' />
                  <TextFormField fieldName='strandingIdNumber' labelText='Stranding ID number' />
                </FormFieldRow>
                <FormFieldRow>
                  <ListFormField fieldName='species' labelText='Species' listItems={species} />
                  <ListFormField fieldName='turtleSize' labelText='Size' listItems={turtleSizes} />
                  <ListFormField fieldName='status' labelText='Status' listItems={turtleStatuses} />
                </FormFieldRow>
                <FormFieldRow>
                  <DateFormField fieldName='dateAcquired' labelText='Date acquired' />
                  <TextFormField fieldName='acquiredFrom' labelText='Acquired from' />
                  <ListFormField fieldName='acquiredCounty' labelText='County' listItems={counties} />
                  <TextFormField fieldName='acquiredLatitude' labelText='Latitude' />
                  <TextFormField fieldName='acquiredLongitude' labelText='Longitude' />
                  <FormField fieldName='dummy'>
                    <button className='button is-link view-on-map-button' type='button' onClick={onShowMapDialogClick('Acquired')}>
                      <span className='icon'>
                        <i className='fa fa-globe'></i>
                      </span>
                      &nbsp;&nbsp;&nbsp;View on map
                    </button>
                  </FormField>
                </FormFieldRow>
                <FormFieldRow>
                  <DateFormField fieldName='dateRelinquished' labelText='Date relinquished' />
                  <TextFormField fieldName='relinquishedTo' labelText='Relinquished to' />
                  <ListFormField fieldName='relinquishedCounty' labelText='County' listItems={counties} />
                  <TextFormField fieldName='relinquishedLatitude' labelText='Latitude' />
                  <TextFormField fieldName='relinquishedLongitude' labelText='Longitude' />
                  <FormField fieldName='dummy'>
                    <button className='button is-link view-on-map-button' type='button' onClick={onShowMapDialogClick('Relinquished')}>
                      <span className='icon'>
                        <i className='fa fa-globe'></i>
                      </span>
                      &nbsp;&nbsp;&nbsp;View on map
                    </button>
                  </FormField>
                </FormFieldRow>
                <FormFieldRow>
                  <TextareaFormField fieldName='anomalies' labelText='Anomalies' />
                  <FormFieldGroup fieldClass='checkbox-group checkboxes-4' labelText='Injuries'>
                    <CheckboxFormField fieldName='injuryBoatStrike' labelText='Boat/Propeller strike' />
                    <CheckboxFormField fieldName='injuryIntestinalImpaction' labelText='Intestinal impaction' />
                    <CheckboxFormField fieldName='injuryLineEntanglement' labelText='Line/net entanglement' />
                    <CheckboxFormField fieldName='injuryFishHook' labelText='Fish hook' />
                    <CheckboxFormField fieldName='injuryUpperRespiratory' labelText='Upper respiratory' />
                    <CheckboxFormField fieldName='injuryAnimalBite' labelText='Animal bite' />
                    <CheckboxFormField fieldName='injuryFibropapilloma' labelText='Fibropapilloma' />
                    <CheckboxFormField fieldName='injuryMiscEpidemic' labelText='Misc. epidemic' />
                    <CheckboxFormField fieldName='injuryDoa' labelText='DOA' />
                    <CheckboxFormField fieldName='injuryOther' labelText='Other' />
                  </FormFieldGroup>
                </FormFieldRow>
                <hr />

                <h2 className='subtitle'>Initial Encounter Information</h2>
                <FormFieldRow>
                  <FormFieldGroup fieldClass='checkbox-group checkboxes-1' labelText='Initial encounter'>
                    <CheckboxFormField fieldName='wasCarryingTagsWhenEnc' labelText='Was turtle carrying tags when initially encountered?' />
                  </FormFieldGroup>
                  <ListFormField fieldName='recaptureType' labelText='If yes, recapture type' listItems={recaptureTypes} />
                  <TextFormField fieldName='tagReturnAddress' labelText='Tag return address' />
                </FormFieldRow>
                <FormFieldRow>
                  <ListFormField fieldName='captureProjectType' labelText='Project type' listItems={captureProjectTypes} />
                  <ListFormField fieldName='didTurtleNest' labelText='If "Nesting Beach," did turtle nest?' listItems={yesNoUndetermineds} />
                  <TextFormField fieldName='captureProjectOther' labelText='If "Other," describe' />
                </FormFieldRow>
                <hr />

                <h2 className='subtitle'>Inspected and/or Scanned For</h2>
                <FormFieldRow>
                  <FormFieldGroup fieldClass='checkbox-group checkboxes-1' labelText='Inspected for'>
                    <CheckboxFormField fieldName='inspectedForTagScars' labelText='Tag scars' />
                  </FormFieldGroup>
                  <TextFormField fieldName='tagScarsLocated' labelText='Located?' />
                  <FormFieldGroup fieldClass='checkbox-group checkboxes-1' labelText='Scanned for'>
                    <CheckboxFormField fieldName='scannedForPitTags' labelText='PIT tags' />
                  </FormFieldGroup>
                  <TextFormField fieldName='pitTagsScanFrequency' labelText='Frequency?' />
                </FormFieldRow>
                <FormFieldRow>
                  <FormFieldGroup fieldClass='checkbox-group checkboxes-1' labelText='Scanned for'>
                    <CheckboxFormField fieldName='scannedForMagneticWires' labelText='Magnetic wires' />
                  </FormFieldGroup>
                  <TextFormField fieldName='magneticWiresLocated' labelText='Located?' />
                  <FormFieldGroup fieldClass='checkbox-group checkboxes-1' labelText='Inspected for'>
                    <CheckboxFormField fieldName='inspectedForLivingTags' labelText='Living tags' />
                  </FormFieldGroup>
                  <TextFormField fieldName='livingTagsLocated' labelText='Located?' />
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

export default SeaTurtles;
