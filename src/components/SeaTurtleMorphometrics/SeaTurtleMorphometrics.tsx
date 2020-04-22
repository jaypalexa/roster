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
import CodeListTableService, { CodeTableType } from '../../services/CodeTableListService';
import SeaTurtleMorphometricService from '../../services/SeaTurtleMorphometricService';
import NameValuePair from '../../types/NameValuePair';
import SeaTurtleMorphometricModel from '../../types/SeaTurtleMorphometricModel';
import YesNoCancelDialog from '../Dialogs/YesNoCancelDialog';
import YesNoDialog from '../Dialogs/YesNoDialog';
import DateFormField from '../FormFields/DateFormField';
import FormFieldRow from '../FormFields/FormFieldRow';
import ListFormField from '../FormFields/ListFormField';
import TextFormField from '../FormFields/TextFormField';
import LeaveThisPagePrompt from '../LeaveThisPagePrompt/LeaveThisPagePrompt';
import './SeaTurtleMorphometrics.sass';

/* eslint-disable jsx-a11y/anchor-is-valid */

const SeaTurtleMorphometrics: React.FC = () => {

  // eslint-disable-next-line
  const [appContext, setAppContext] = useAppContext();
  const methods = useForm<SeaTurtleMorphometricModel>({ mode: 'onChange' });
  const { handleSubmit, formState, reset } = methods;
  const [currentSeaTurtleMorphometric, setCurrentSeaTurtleMorphometric] = useState({} as SeaTurtleMorphometricModel);
  const [currentSeaTurtleMorphometrics, setCurrentSeaTurtleMorphometrics] = useState([] as Array<SeaTurtleMorphometricModel>);
  const [cmIns, setCmIns] = useState([] as Array<NameValuePair>);
  const [kgLbs, setKgLbs] = useState([] as Array<NameValuePair>);
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

  // console.log(JSON.stringify(formState));
  // console.log(JSON.stringify(methods.errors));

  const seaTurtleMorphometricTableColumns = [
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      style: '{padding-left: 1rem}',
      cell: (row: SeaTurtleMorphometricModel) => <span className='icon cursor-pointer' onClick={(event) => { onEditSeaTurtleMorphometricClick(row.turtleMorphometricId, event) }}><i className='fa fa-pencil'></i></span>,
    },
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      cell: (row: SeaTurtleMorphometricModel) => <span className='icon cursor-pointer' onClick={(event) => { onDeleteSeaTurtleMorphometricClick(row.turtleMorphometricId, row.dateMeasured ? moment(row.dateMeasured).format('YYYY-MM-DD') : '', event) }}><i className='fa fa-trash'></i></span>,
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
    // make async server request
    if (!appContext.seaTurtle?.turtleId) {
      browserHistory.push('/sea-turtles')
    } else {
      const getSeaTurtleMorphometricsForTurtle = async () => {
        const seaTurtleMorphometrics = await SeaTurtleMorphometricService.getSeaTurtleMorphometricsForTurtle(appContext.seaTurtle?.turtleId);
        setCurrentSeaTurtleMorphometrics(seaTurtleMorphometrics);
      };
      getSeaTurtleMorphometricsForTurtle();
    }
  });

  useEffect(() => {
    if (editingStarted && firstEditControlRef?.current !== null) {
      firstEditControlRef.current.focus();
    }
    setEditingStarted(false);
  }, [editingStarted]);

  const fetchSeaTurtleMorphometric = (turtleMorphometricId: string) => {
    // make async server request
    const getSeaTurtleMorphometric = async () => {
      const seaTurtleMorphometric = await SeaTurtleMorphometricService.getSeaTurtleMorphometric(turtleMorphometricId);
      reset(seaTurtleMorphometric);
      setCurrentSeaTurtleMorphometric(seaTurtleMorphometric);
    };
    getSeaTurtleMorphometric();
  };

  const deleteSeaTurtleMorphometric = (turtleMorphometricId: string) => {
    // make async server request
    const deleteSeaTurtleMorphometric = async () => {
      await SeaTurtleMorphometricService.deleteSeaTurtleMorphometric(turtleMorphometricId);
      const seaTurtleMorphometric = {} as SeaTurtleMorphometricModel;
      reset(seaTurtleMorphometric);
      setCurrentSeaTurtleMorphometric(seaTurtleMorphometric);
      const index = currentSeaTurtleMorphometrics.findIndex(x => x.turtleMorphometricId === turtleMorphometricId);
      if (~index) {
        var updatedCurrentSeaTurtleMorphometrics = [...currentSeaTurtleMorphometrics];
        updatedCurrentSeaTurtleMorphometrics.splice(index, 1)
        setCurrentSeaTurtleMorphometrics(updatedCurrentSeaTurtleMorphometrics);
      }
    };
    deleteSeaTurtleMorphometric();
  };

  const onAddSeaTurtleMorphometricButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const handleEvent = () => {
      const seaTurtleMorphometric = {} as SeaTurtleMorphometricModel;
      seaTurtleMorphometric.turtleMorphometricId = uuidv4();
      seaTurtleMorphometric.turtleId = appContext.seaTurtle?.turtleId || '';
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

  const onEditSeaTurtleMorphometricClick = (turtleMorphometricId: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const handleEvent = () => {
      fetchSeaTurtleMorphometric(turtleMorphometricId);
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

  const onDeleteSeaTurtleMorphometricClick = (turtleMorphometricId: string, dateMeasured: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const handleEvent = () => {
      deleteSeaTurtleMorphometric(turtleMorphometricId);
      setIsFormEnabled(false);
    };

    setDialogTitleText('Confirm Deletion');
    setDialogBodyText(`Delete morphometric for '${dateMeasured}' ?`);
    setOnDialogYes(() => async () => {
      handleEvent();
      setShowYesNoDialog(false);
    });
    setOnDialogNo(() => () => {
      setShowYesNoDialog(false);
    });
    setShowYesNoDialog(true);
  };

  const onSubmitSeaTurtleMorphometric = handleSubmit((modifiedSeaTurtleMorphometric: SeaTurtleMorphometricModel) => {
    console.log('In onSubmit()', modifiedSeaTurtleMorphometric);
    const patchedSeaTurtleMorphometric = { ...currentSeaTurtleMorphometric, ...modifiedSeaTurtleMorphometric };
    SeaTurtleMorphometricService.saveSeaTurtleMorphometric(patchedSeaTurtleMorphometric);
    reset(patchedSeaTurtleMorphometric);
    setCurrentSeaTurtleMorphometric(patchedSeaTurtleMorphometric);
    const index = currentSeaTurtleMorphometrics.findIndex(x => x.turtleMorphometricId === patchedSeaTurtleMorphometric.turtleMorphometricId);
    if (~index) {
      currentSeaTurtleMorphometrics[index] = { ...patchedSeaTurtleMorphometric };
    } else {
      currentSeaTurtleMorphometrics.push(patchedSeaTurtleMorphometric);
    }
    setCurrentSeaTurtleMorphometrics([...currentSeaTurtleMorphometrics]);

    toast.success('Record saved');
  });

  const onCancelSeaTurtleMorphometric = () => {
    reset(currentSeaTurtleMorphometric);
  };

  return (
    <div id='seaTurtleMorphometrics'>
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
          <li className='is-active'><a href='#' aria-current='page'>Morphometrics</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb shown-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/sea-turtles'>&#10094; Sea Turtles</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>Morphometrics for {appContext.seaTurtle?.turtleName}</h1>
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

          <DataTable
            title='Morphometrics'
            columns={seaTurtleMorphometricTableColumns}
            data={currentSeaTurtleMorphometrics}
            keyField='turtleMorphometricId'
            defaultSortField='dateMeasured'
            noHeader={true}
            fixedHeader={true}
            fixedHeaderScrollHeight='9rem'
            customStyles={tableCustomStyles}
          />

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
