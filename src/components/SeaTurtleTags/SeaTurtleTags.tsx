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
import SeaTurtleTagModel from 'models/SeaTurtleTagModel';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import CodeListTableService, { CodeTableType } from 'services/CodeTableListService';
import SeaTurtleTagService from 'services/SeaTurtleTagService';
import ToastService from 'services/ToastService';
import sharedStyles from 'styles/sharedStyles';
import { actionIcons, constants, tableIcons } from 'utils';
import { v4 as uuidv4 } from 'uuid';

const SeaTurtleTags: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles({...sharedStyles(theme)})
  );
  const classes = useStyles();

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

  const [tableColumns] = useState([
    {
      title: 'Tag Number',
      field: 'tagNumber',
    },
    {
      title: 'Tag Type',
      field: 'tagType',
    },
    {
      title: 'Location',
      field: 'location',
    },
    {
      title: 'Date Tagged',
      field: 'dateTagged',
      render: (rowData: SeaTurtleTagModel) => <span>{rowData.dateTagged ? moment(rowData.dateTagged).format('YYYY-MM-DD') : ''}</span>,
    },
  ]);

  useMount(() => {
    setTagTypes(CodeListTableService.getList(CodeTableType.TagType, true));
    setLocations(CodeListTableService.getList(CodeTableType.TagLocation, true));
  });

  useMount(() => {
    const seaTurtleId = appContext.seaTurtle?.seaTurtleId;
    if (!seaTurtleId) {
      browserHistory.push('/sea-turtles')
    } else {
      const getSeaTurtleTags = async () => {
        try {
          setShowSpinner(true);
          const seaTurtleTags = await SeaTurtleTagService.getSeaTurtleTags(seaTurtleId);
          setCurrentSeaTurtleTags(seaTurtleTags);
        }
        catch (err) {
          console.log(err);
          ToastService.error(constants.ERROR.GENERIC);
        }
        finally {
          setShowSpinner(false);
        }
      };
      getSeaTurtleTags();
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
      ToastService.error(constants.ERROR.GENERIC);
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
      ToastService.error(constants.ERROR.GENERIC);
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
    reset(currentSeaTurtleTag);
  };

  return (
    <div id='seaTurtleTags'>
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
        <Typography color='textPrimary'>Tags</Typography>
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
                onClick={onAddSeaTurtleTagButtonClick} 
                startIcon={<IconMui icon='add' />}
          >
                Add Tag
              </Button>
            </Grid>
          </Grid>

          <div className={classes.horizontalScroll}>
            <MaterialTable
              icons={tableIcons}
              columns={tableColumns}
              data={[...currentSeaTurtleTags]}
              options={{filtering: true, showTitle: false}}
              onRowClick={(event, data) => onEditSeaTurtleTagClick(data as SeaTurtleTagModel)}
              actions={[
                {
                  icon: actionIcons.EditIcon,
                  tooltip: 'Edit',
                  onClick: (event, data) => onEditSeaTurtleTagClick(data as SeaTurtleTagModel)
                },
                {
                  icon: actionIcons.DeleteIcon,
                  tooltip: 'Delete',
                  onClick: (event, data) => onDeleteSeaTurtleTagClick(data as SeaTurtleTagModel)
                },
              ]}
            />
          </div>
          <hr />

          <FormContext {...methods} >
            <form onSubmit={onSubmitSeaTurtleTag}>
              <fieldset disabled={!isFormEnabled}>
                <FormFieldRowMui>
                  <TextFormFieldMui fieldName='tagNumber' labelText='Tag Number' validationOptions={{ required: 'Tag Number is required' }} refObject={firstEditControlRef} />
                  <ListFormFieldMui fieldName='tagType' labelText='Tag Type' listItems={tagTypes} />
                  <ListFormFieldMui fieldName='location' labelText='Location' listItems={locations} />
                  <DateFormFieldMui fieldName='dateTagged' labelText='Date Tagged' />
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

export default SeaTurtleTags;
