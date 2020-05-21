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
import SeaTurtleTagModel from 'models/SeaTurtleTagModel';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import CodeListTableService, { CodeTableType } from 'services/CodeTableListService';
import SeaTurtleTagService from 'services/SeaTurtleTagService';
import { constants } from 'utils';
import { v4 as uuidv4 } from 'uuid';
import './SeaTurtleTags.sass';

const SeaTurtleTags: React.FC = () => {

  const [appContext] = useAppContext();
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
      cell: (row: SeaTurtleTagModel) => <span className='icon cursor-pointer' onClick={() => onEditSeaTurtleTagClick(row)}><i className='fa fa-pencil fa-lg' title='Edit'></i></span>,
    },
    {
      name: '',
      ignoreRowClick: true,
      maxWidth: '2rem',
      minWidth: '2rem',
      cell: (row: SeaTurtleTagModel) => <span className='icon cursor-pointer' onClick={() => onDeleteSeaTurtleTagClick(row)}><i className='fa fa-trash fa-lg' title='Delete'></i></span>,
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
    window.scrollTo(0, 0);
  });

  useMount(() => {
    setTagTypes(CodeListTableService.getList(CodeTableType.TagType, true));
    setLocations(CodeListTableService.getList(CodeTableType.TagLocation, true));
  });

  useMount(() => {
    const seaTurtleId = appContext.seaTurtle?.seaTurtleId;
    if (!seaTurtleId) {
      browserHistory.push('/sea-turtles')
    } else {
      const getSeaTurtleTagsForTurtle = async () => {
        try {
          setShowSpinner(true);
          const seaTurtleTags = await SeaTurtleTagService.getSeaTurtleTags(seaTurtleId);
          setCurrentSeaTurtleTags(seaTurtleTags);
        }
        catch (err) {
          console.log(err);
          toast.error(constants.ERROR.GENERIC);
        }
        finally {
          setShowSpinner(false);
        }
      };
      getSeaTurtleTagsForTurtle();
    } 
  });

  useEffect(() => {
    if (editingStarted && firstEditControlRef?.current !== null) {
      firstEditControlRef.current.focus();
    }
    setEditingStarted(false);
  }, [editingStarted]);

  const fetchSeaTurtleTag = async (seaTurtleTagId: string) => {
    try {
      const seaTurtleId = appContext.seaTurtle?.seaTurtleId;
      if (!seaTurtleId) return;
      
      setShowSpinner(true);
      const seaTurtleTag = await SeaTurtleTagService.getSeaTurtleTag(seaTurtleId, seaTurtleTagId);
      reset(seaTurtleTag);
      setCurrentSeaTurtleTag(seaTurtleTag);
    } 
    catch (err) {
      console.log(err);
      toast.error(constants.ERROR.GENERIC);
    }
    finally {
      setShowSpinner(false);
    }
  };

  const deleteSeaTurtleTag = async (seaTurtleTagId: string) => {
    const seaTurtleId = appContext.seaTurtle?.seaTurtleId;
    if (!seaTurtleId) return;
    
    try {
      setShowSpinner(true);
      await SeaTurtleTagService.deleteSeaTurtleTag(seaTurtleId, seaTurtleTagId);
      const seaTurtleTag = {} as SeaTurtleTagModel;
      reset(seaTurtleTag);
      setCurrentSeaTurtleTag(seaTurtleTag);
      const index = currentSeaTurtleTags.findIndex(x => x.seaTurtleTagId === seaTurtleTagId);
      if (~index) {
        var updatedCurrentSeaTurtleTags = [...currentSeaTurtleTags];
        updatedCurrentSeaTurtleTags.splice(index, 1)
        setCurrentSeaTurtleTags(updatedCurrentSeaTurtleTags);
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

  const onAddSeaTurtleTagButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const handleEvent = () => {
      const seaTurtleTag = {} as SeaTurtleTagModel;
      seaTurtleTag.seaTurtleTagId = uuidv4().toLowerCase();
      seaTurtleTag.seaTurtleId = appContext.seaTurtle?.seaTurtleId || '';
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

  const onEditSeaTurtleTagClick = (seaTurtleTag: SeaTurtleTagModel) => {
    const handleEvent = () => {
      fetchSeaTurtleTag(seaTurtleTag.seaTurtleTagId);
      setIsFormEnabled(true);
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

  const onDeleteSeaTurtleTagClick = (seaTurtleTag: SeaTurtleTagModel) => {
    const handleEvent = () => {
      deleteSeaTurtleTag(seaTurtleTag.seaTurtleTagId);
      setIsFormEnabled(false);
    };

    setDialogTitleText('Confirm Deletion');
    setDialogBodyText(`Delete tag '${seaTurtleTag.tagNumber}'?`);
    setOnDialogYes(() => async () => {
      handleEvent();
      setShowYesNoDialog(false);
    });
    setOnDialogNo(() => () => {
      setShowYesNoDialog(false);
    });
    setShowYesNoDialog(true);
  };

  const onSubmitSeaTurtleTag = handleSubmit(async (modifiedSeaTurtleTag: SeaTurtleTagModel) => {
    try {
      setShowSpinner(true);
      const patchedSeaTurtleTag = { ...currentSeaTurtleTag, ...modifiedSeaTurtleTag };
      await SeaTurtleTagService.saveSeaTurtleTag(patchedSeaTurtleTag);
      reset(patchedSeaTurtleTag);
      setCurrentSeaTurtleTag(patchedSeaTurtleTag);
      const index = currentSeaTurtleTags.findIndex(x => x.seaTurtleTagId === patchedSeaTurtleTag.seaTurtleTagId);
      if (~index) {
        currentSeaTurtleTags[index] = { ...patchedSeaTurtleTag };
      } else {
        currentSeaTurtleTags.push(patchedSeaTurtleTag);
      }
      setCurrentSeaTurtleTags([...currentSeaTurtleTags]);

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

  const onCancelSeaTurtleTag = () => {
    reset(currentSeaTurtleTag);
  };

  return (
    <div id='seaTurtleTags'>
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
          <li className='is-active'><a href='/#' aria-current='page'>Tags</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb shown-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/sea-turtles'>&#10094; Sea Turtles</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>Tags for {appContext.seaTurtle?.seaTurtleName}</h1>
          <div className='level'>
            <div className='level-left'></div>
            <div className='level-right'>
              <p className='level-item'>
                <button className='button is-link' onClick={onAddSeaTurtleTagButtonClick}>
                  <span className='icon'>
                    <i className='fa fa-plus'></i>
                  </span>
                  &nbsp;&nbsp;&nbsp;Add Tag
                </button>
              </p>
            </div>
          </div>

          <DataTableExtensions 
            columns={tableColumns} 
            data={currentSeaTurtleTags} 
            export={false} 
            print={false}
          >
            <DataTable
              title='Tags'
              columns={tableColumns}
              data={currentSeaTurtleTags}
              keyField='seaTurtleTagId'
              defaultSortField='tagNumber'
              noHeader={true}
              fixedHeader={true}
              fixedHeaderScrollHeight='9rem'
              customStyles={tableCustomStyles}
              pagination
              highlightOnHover
              onRowClicked={onEditSeaTurtleTagClick}
            />
          </DataTableExtensions>
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
