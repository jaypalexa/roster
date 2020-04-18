import useMount from 'hooks/UseMount';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../../contexts/AppContext';
import CodeListTableService, { CodeTableType } from '../../services/CodeTableListService';
import SeaTurtleTagService from '../../services/SeaTurtleTagService';
import NameValuePair from '../../types/NameValuePair';
import SeaTurtleTagModel from '../../types/SeaTurtleTagModel';
import YesNoCancelDialog from '../Dialogs/YesNoCancelDialog';
import YesNoDialog from '../Dialogs/YesNoDialog';
import DateFormField from '../FormFields/DateFormField';
import FormFieldRow from '../FormFields/FormFieldRow';
import ListFormField from '../FormFields/ListFormField';
import TextFormField from '../FormFields/TextFormField';
import LeaveThisPagePrompt from '../LeaveThisPagePrompt/LeaveThisPagePrompt';
import './SeaTurtleTags.sass';

/* eslint-disable jsx-a11y/anchor-is-valid */

const SeaTurtleTags: React.FC = () => {

  // eslint-disable-next-line
  const [appContext, setAppContext] = useAppContext();
  const methods = useForm<SeaTurtleTagModel>({ mode: 'onChange' });
  const { handleSubmit, formState, reset } = methods;
  const [currentSeaTurtleTag, setCurrentSeaTurtleTag] = useState({} as SeaTurtleTagModel);
  const [currentSeaTurtleTags, setCurrentSeaTurtleTags] = useState([] as Array<SeaTurtleTagModel>);
  const [locations, setLocations] = useState([] as Array<NameValuePair>);
  const [tagTypes, setTagTypes] = useState([] as Array<NameValuePair>);
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

  const seaTurtleTagTableColumns = [
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      style: '{padding-left: 1rem}',
      cell: (row: SeaTurtleTagModel) => <span className='icon cursor-pointer' onClick={(event) => { onEditSeaTurtleTagClick(row.turtleTagId, event) }}><i className='fa fa-pencil'></i></span>,
    },
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      cell: (row: SeaTurtleTagModel) => <span className='icon cursor-pointer' onClick={(event) => { onDeleteSeaTurtleTagClick(row.turtleTagId, row.tagNumber, event) }}><i className='fa fa-trash'></i></span>,
    },
    {
      name: 'Tag Number',
      selector: 'tagNumber',
      sortable: true
    },
    {
      name: 'Tag Type',
      selector: 'tagType',
      sortable: true
    },
    {
      name: 'Location',
      selector: 'location',
      sortable: true,
      hide: 599
    },
    {
      name: 'Date Tagged',
      selector: (row: SeaTurtleTagModel) => row.dateTagged ? moment(row.dateTagged).format('YYYY-MM-DD') : '',
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
    setTagTypes(CodeListTableService.getList(CodeTableType.TagType, true));
    setLocations(CodeListTableService.getList(CodeTableType.TagLocation, true));
  });

  useMount(() => {
    // make async server request
    const getSeaTurtleTagsForTurtle = async () => {
      const seaTurtleTags = await SeaTurtleTagService.getSeaTurtleTagsForTurtle(appContext.seaTurtle?.turtleId);
      setCurrentSeaTurtleTags(seaTurtleTags);
    };
    getSeaTurtleTagsForTurtle();
  });

  useEffect(() => {
    if (editingStarted && firstEditControlRef?.current !== null) {
      firstEditControlRef.current.focus();
    }
    setEditingStarted(false);
  }, [editingStarted]);

  const fetchSeaTurtleTag = (turtleTagId: string) => {
    // make async server request
    const getSeaTurtleTag = async () => {
      const seaTurtleTag = await SeaTurtleTagService.getSeaTurtleTag(turtleTagId);
      reset(seaTurtleTag);
      setCurrentSeaTurtleTag(seaTurtleTag);
    };
    getSeaTurtleTag();
  };

  const deleteSeaTurtleTag = (turtleTagId: string) => {
    // make async server request
    const deleteSeaTurtleTag = async () => {
      await SeaTurtleTagService.deleteSeaTurtleTag(turtleTagId);
      const seaTurtleTag = {} as SeaTurtleTagModel;
      reset(seaTurtleTag);
      setCurrentSeaTurtleTag(seaTurtleTag);
      const index = currentSeaTurtleTags.findIndex(x => x.turtleTagId === turtleTagId);
      if (~index) {
        var updatedCurrentSeaTurtleTags = [...currentSeaTurtleTags];
        updatedCurrentSeaTurtleTags.splice(index, 1)
        setCurrentSeaTurtleTags(updatedCurrentSeaTurtleTags);
      }
    };
    deleteSeaTurtleTag();
  };

  const onAddNewSeaTurtleTagButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const handleEvent = () => {
      const seaTurtleTag = {} as SeaTurtleTagModel;
      seaTurtleTag.turtleTagId = uuidv4();
      seaTurtleTag.turtleId = appContext.seaTurtle?.turtleId || '';
      reset(seaTurtleTag);
      setCurrentSeaTurtleTag(seaTurtleTag);
      setIsFormEnabled(true);
      setEditingStarted(true);
    };

    if (formState.dirty) {
      setDialogTitleText('Unsaved Changes');
      setDialogBodyText('Save changes?');
      setOnDialogYes(() => async () => {
        await onSubmitSeaTurtleTag();
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

  const onEditSeaTurtleTagClick = (turtleTagId: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const handleEvent = () => {
      fetchSeaTurtleTag(turtleTagId);
      setIsFormEnabled(true);
      // setEditingStarted(true);
    };

    if (formState.dirty) {
      setDialogTitleText('Unsaved Changes');
      setDialogBodyText('Save changes?');
      setOnDialogYes(() => async () => {
        await onSubmitSeaTurtleTag();
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

  const onDeleteSeaTurtleTagClick = (turtleTagId: string, tagNumber: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const handleEvent = () => {
      deleteSeaTurtleTag(turtleTagId);
      setIsFormEnabled(false);
    };

    setDialogTitleText('Confirm Deletion');
    setDialogBodyText(`Delete tag '${tagNumber}' ?`);
    setOnDialogYes(() => async () => {
      handleEvent();
      setShowYesNoDialog(false);
    });
    setOnDialogNo(() => () => {
      setShowYesNoDialog(false);
    });
    setShowYesNoDialog(true);
  };

  const onSubmitSeaTurtleTag = handleSubmit((modifiedSeaTurtleTag: SeaTurtleTagModel) => {
    console.log('In onSubmit()', modifiedSeaTurtleTag);
    const patchedSeaTurtleTag = { ...currentSeaTurtleTag, ...modifiedSeaTurtleTag };
    SeaTurtleTagService.saveSeaTurtleTag(patchedSeaTurtleTag);
    reset(patchedSeaTurtleTag);
    setCurrentSeaTurtleTag(patchedSeaTurtleTag);
    const index = currentSeaTurtleTags.findIndex(x => x.turtleTagId === patchedSeaTurtleTag.turtleTagId);
    if (~index) {
      currentSeaTurtleTags[index] = { ...patchedSeaTurtleTag };
    } else {
      currentSeaTurtleTags.push(patchedSeaTurtleTag);
    }
    setCurrentSeaTurtleTags([...currentSeaTurtleTags]);

    toast.success('Record saved');
  });

  const onCancelSeaTurtleTag = () => {
    reset(currentSeaTurtleTag);
  };

  return (
    <div id='seaTurtleTag'>
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
          <li className='is-active'><a href='#' aria-current='page'>Tags</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb shown-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/sea-turtles'>&#10094; Sea Turtles</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>Tags for {appContext.seaTurtle?.turtleName}</h1>
          <div className='level'>
            <div className='level-left'></div>
            <div className='level-right'>
              <p className='level-item'>
                <button className='button is-link' onClick={onAddNewSeaTurtleTagButtonClick}>
                  <span className='icon'>
                    <i className='fa fa-plus'></i>
                  </span>
                  &nbsp;&nbsp;&nbsp;Add New Tag
                </button>
              </p>
            </div>
          </div>

          <DataTable
            title='Tags'
            columns={seaTurtleTagTableColumns}
            data={currentSeaTurtleTags}
            keyField='turtleTagId'
            defaultSortField='tagNumber'
            noHeader={true}
            fixedHeader={true}
            fixedHeaderScrollHeight='9rem'
            customStyles={tableCustomStyles}
          />

          <hr />

          <FormContext {...methods} >
            <form onSubmit={onSubmitSeaTurtleTag}>
              <fieldset disabled={!isFormEnabled}>
                <FormFieldRow>
                  <TextFormField fieldName='tagNumber' labelText='Tag Number' validationOptions={{ required: 'Tag Number is required' }} refObject={firstEditControlRef} />
                  <ListFormField fieldName='tagType' labelText='Tag Type' listItems={tagTypes} />
                  <ListFormField fieldName='location' labelText='Location' listItems={locations} />
                  <DateFormField fieldName='dateTagged' labelText='Date Tagged' />
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
                      onClick={() => onCancelSeaTurtleTag()}
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

export default SeaTurtleTags;
