import browserHistory from 'browserHistory';
import YesNoCancelDialog from 'components/Dialogs/YesNoCancelDialog';
import YesNoDialog from 'components/Dialogs/YesNoDialog';
import DateFormField from 'components/FormFields/DateFormField';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import ListFormField from 'components/FormFields/ListFormField';
import TextFormField from 'components/FormFields/TextFormField';
import LeaveThisPagePrompt from 'components/LeaveThisPagePrompt/LeaveThisPagePrompt';
import Spinner from 'components/Spinner/Spinner';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import NameValuePair from 'models/NameValuePair';
import OrganizationModel from 'models/OrganizationModel';
import SeaTurtleMorphometricModel from 'models/SeaTurtleMorphometricModel';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import CodeListTableService, { CodeTableType } from 'services/CodeTableListService';
import OrganizationService from 'services/OrganizationService';
import SeaTurtleMorphometricService from 'services/SeaTurtleMorphometricService';
import { constants } from 'utils';
import { v4 as uuidv4 } from 'uuid';
import './SeaTurtleMorphometrics.sass';

const SeaTurtleMorphometrics: React.FC = () => {

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

  const tableColumns = [
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      style: '{padding-left: 1rem}',
      cell: (row: SeaTurtleMorphometricModel) => <span className='icon cursor-pointer' onClick={() => onEditSeaTurtleMorphometricClick(row)}><i className='fa fa-pencil fa-lg' title='Edit'></i></span>,
    },
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      cell: (row: SeaTurtleMorphometricModel) => <span className='icon cursor-pointer' onClick={() => onDeleteSeaTurtleMorphometricClick(row)}><i className='fa fa-trash fa-lg' title='Delete'></i></span>,
    },
    {
      name: 'Date Measured',
      selector: (row: SeaTurtleMorphometricModel) => row.dateMeasured ? moment(row.dateMeasured).format('YYYY-MM-DD') : '',
      sortable: true,
    },
    {
      name: 'SCL notch-notch',
      selector: 'sclNotchNotchValue',
      right: true,
      sortable: true
    },
    {
      name: 'SCL notch-tip',
      selector: 'sclNotchTipValue',
      right: true,
      sortable: true
    },
    {
      name: 'SCL tip-tip',
      selector: 'sclTipTipValue',
      right: true,
      sortable: true,
      hide: 599
    },
    {
      name: 'SCW',
      selector: 'scwValue',
      right: true,
      sortable: true,
      hide: 599
    },
    {
      name: 'CCL notch-notch',
      selector: 'cclNotchNotchValue',
      right: true,
      sortable: true,
      hide: 599
    },
    {
      name: 'CCL notch-tip',
      selector: 'cclNotchTipValue',
      right: true,
      sortable: true,
      hide: 599
    },
    {
      name: 'CCL tip-tip',
      selector: 'cclTipTipValue',
      right: true,
      sortable: true,
      hide: 599
    },
    {
      name: 'CCW',
      selector: 'ccwValue',
      right: true,
      sortable: true,
      hide: 599
    },
    {
      name: 'Weight',
      selector: 'weightValue',
      right: true,
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
    setCmIns(CodeListTableService.getList(CodeTableType.CmIn, true));
    setKgLbs(CodeListTableService.getList(CodeTableType.KgLb, true));
  });

  useMount(() => {
    const seaTurtleId = appContext.seaTurtle?.seaTurtleId;
    if (!seaTurtleId) {
      browserHistory.push('/sea-turtles')
    } else {
      const getSeaTurtleMorphometricsForTurtle = async () => {
        try {
          setShowSpinner(true);
          const seaTurtleMorphometrics = await SeaTurtleMorphometricService.getSeaTurtleMorphometrics(seaTurtleId);
          setCurrentSeaTurtleMorphometrics(seaTurtleMorphometrics);
        }
        catch (err) {
          console.log(err);
          toast.error(constants.ERROR.GENERIC);
        }
        finally {
          setShowSpinner(false);
        }
      };
      getSeaTurtleMorphometricsForTurtle();
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
        toast.error(constants.ERROR.GENERIC);
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
      toast.error(constants.ERROR.GENERIC);
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
      toast.error(constants.ERROR.GENERIC);
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

    toast.success('Record saved');
    } 
    catch (err) {
      console.log(err);
      toast.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  });

  const onCancelSeaTurtleMorphometric = () => {
    reset(currentSeaTurtleMorphometric);
  };

  return (
    <div id='seaTurtleMorphometrics'>
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
          <li><Link to='/sea-turtles'>Sea Turtles</Link></li>
          <li className='is-active'><a href='/#' aria-current='page'>Morphometrics Measurements</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb shown-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/sea-turtles'>&#10094; Sea Turtles</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>Morphometrics for {appContext.seaTurtle?.seaTurtleName}</h1>
          <div className='level'>
            <div className='level-left'></div>
            <div className='level-right'>
              <p className='level-item'>
                <button className='button is-link' onClick={onAddSeaTurtleMorphometricButtonClick}>
                  <span className='icon'>
                    <i className='fa fa-plus'></i>
                  </span>
                  &nbsp;&nbsp;&nbsp;Add Morphometric
                </button>
              </p>
            </div>
          </div>

          <DataTableExtensions 
            columns={tableColumns} 
            data={currentSeaTurtleMorphometrics} 
            export={false} 
            print={false}
          >
            <DataTable
              title='Morphometrics'
              columns={tableColumns}
              data={currentSeaTurtleMorphometrics}
              keyField='turtleMorphometricId'
              defaultSortField='dateMeasured'
              noHeader={true}
              fixedHeader={true}
              fixedHeaderScrollHeight='9rem'
              customStyles={tableCustomStyles}
              pagination
              highlightOnHover
              onRowClicked={onEditSeaTurtleMorphometricClick}
            />
          </DataTableExtensions>
          <hr />

          <FormContext {...methods} >
            <form onSubmit={onSubmitSeaTurtleMorphometric}>
              <fieldset disabled={!isFormEnabled}>
                <FormFieldRow>
                  <DateFormField fieldName='dateMeasured' labelText='Date Measured' validationOptions={{ required: 'Date Measured is required' }} refObject={firstEditControlRef} />
                </FormFieldRow>
                <FormFieldRow>
                  <TextFormField fieldName='sclNotchNotchValue' labelText='SCL notch-notch' />
                  <ListFormField fieldName='sclNotchNotchUnits' labelText='Units' listItems={cmIns} />
                  <TextFormField fieldName='sclNotchTipValue' labelText='SCL notch-tip' />
                  <ListFormField fieldName='sclNotchTipUnits' labelText='Units' listItems={cmIns} />
                  <TextFormField fieldName='sclTipTipValue' labelText='SCL tip-tip' />
                  <ListFormField fieldName='sclTipTipUnits' labelText='Units' listItems={cmIns} />
                  <TextFormField fieldName='scwValue' labelText='SCW' />
                  <ListFormField fieldName='scwUnits' labelText='Units' listItems={cmIns} />
                </FormFieldRow>
                <FormFieldRow>
                  <TextFormField fieldName='cclNotchNotchValue' labelText='CCL notch-notch' />
                  <ListFormField fieldName='cclNotchNotchUnits' labelText='Units' listItems={cmIns} />
                  <TextFormField fieldName='cclNotchTipValue' labelText='CCL notch-tip' />
                  <ListFormField fieldName='cclNotchTipUnits' labelText='Units' listItems={cmIns} />
                  <TextFormField fieldName='cclTipTipValue' labelText='CCL tip-tip' />
                  <ListFormField fieldName='cclTipTipUnits' labelText='Units' listItems={cmIns} />
                  <TextFormField fieldName='ccwValue' labelText='CCW' />
                  <ListFormField fieldName='ccwUnits' labelText='Units' listItems={cmIns} />
                </FormFieldRow>
                <FormFieldRow>
                  <TextFormField fieldName='weightValue' labelText='Weight' />
                  <ListFormField fieldName='weightUnits' labelText='Units' listItems={kgLbs} />
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
                      onClick={() => onCancelSeaTurtleMorphometric()}
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

export default SeaTurtleMorphometrics;
