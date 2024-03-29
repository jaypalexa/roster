import { Box, Breadcrumbs, Button, Divider, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import browserHistory from 'browserHistory';
import clsx from 'clsx';
import YesNoCancelDialog from 'components/Dialogs/YesNoCancelDialog';
import YesNoDialog from 'components/Dialogs/YesNoDialog';
import DateFormField from 'components/FormFields/DateFormField';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import ListFormField from 'components/FormFields/ListFormField';
import TextFormField from 'components/FormFields/TextFormField';
import Icon from 'components/Icon';
import LeaveThisPagePrompt from 'components/LeaveThisPagePrompt';
import Spinner from 'components/Spinner/Spinner';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import NameValuePair from 'models/NameValuePair';
import SeaTurtleTagModel from 'models/SeaTurtleTagModel';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import CodeListTableService, { CodeTableType } from 'services/CodeTableListService';
import SeaTurtleTagService from 'services/SeaTurtleTagService';
import ToastService from 'services/ToastService';
import sharedStyles from 'styles/sharedStyles';
import { clone, constants } from 'utils';
import { v4 as uuidv4 } from 'uuid';
import DisplayTable from './DisplayTable';

const SeaTurtleTags: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(sharedStyles(theme))
  );
  const classes = useStyles();

  const [appContext] = useAppContext();
  const methods = useForm<SeaTurtleTagModel>({ mode: 'onChange', defaultValues: new SeaTurtleTagModel(), shouldUnregister: false });
  const { handleSubmit, formState, reset } = methods;
  const [currentSeaTurtleTag, setCurrentSeaTurtleTag] = useState(new SeaTurtleTagModel());
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

  const tableColumns = useMemo(() => [
    {
      name: 'Tag Number',
      selector: 'tagNumber',
      sortable: true,
    },
    {
      name: 'Tag Type',
      selector: 'tagType',
      sortable: true,
    },
    {
      name: 'Location',
      selector: 'location',
      sortable: true,
    },
    {
      name: 'Date Tagged',
      selector: 'dateTagged',
      sortable: true,
    },
  ], []);

  /* scroll to top */
  useMount(() => {
    window.scrollTo(0, 0);
  });

  /* fetch listbox data */
  useMount(() => {
    setTagTypes(CodeListTableService.getList(CodeTableType.TagType, true));
    setLocations(CodeListTableService.getList(CodeTableType.TagLocation, true));
  });

  /* fetch table data */
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
      setCurrentSeaTurtleTag(clone(seaTurtleTag));
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
      const seaTurtleTag = new SeaTurtleTagModel();
      reset(seaTurtleTag);
      setCurrentSeaTurtleTag(clone(seaTurtleTag));
      const index = currentSeaTurtleTags.findIndex(x => x.seaTurtleTagId === seaTurtleTagId);
      if (~index) {
        // remove the deleted item from the data table data source
        var updatedCurrentSeaTurtleTags = clone(currentSeaTurtleTags);
        updatedCurrentSeaTurtleTags.splice(index, 1);
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
      const seaTurtleTag = new SeaTurtleTagModel();
      seaTurtleTag.seaTurtleTagId = uuidv4().toLowerCase();
      seaTurtleTag.seaTurtleId = appContext.seaTurtle?.seaTurtleId || '';
      reset(seaTurtleTag);
      setCurrentSeaTurtleTag(clone(seaTurtleTag));
      setIsFormEnabled(true);
      setEditingStarted(true);
    };

    if (formState.isDirty) {
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

  const onEditSeaTurtleTagClick = (seaTurtleTag: SeaTurtleTagModel) => {
    const handleEvent = () => {
      fetchSeaTurtleTag(seaTurtleTag.seaTurtleTagId);
      setIsFormEnabled(true);
    };

    if (formState.isDirty) {
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

  const onSubmit = handleSubmit(async (modifiedSeaTurtleTag: SeaTurtleTagModel) => {
    if (!formState.isDirty) return;

    await saveSeaTurtleTag(modifiedSeaTurtleTag);
    ToastService.success('Record saved');
  });

  const saveSeaTurtleTag = async (modifiedSeaTurtleTag: SeaTurtleTagModel) => {
    try {
      setShowSpinner(true);
      const patchedSeaTurtleTag = { ...currentSeaTurtleTag, ...modifiedSeaTurtleTag };
      await SeaTurtleTagService.saveSeaTurtleTag(patchedSeaTurtleTag);
      reset(patchedSeaTurtleTag);
      setCurrentSeaTurtleTag(clone(patchedSeaTurtleTag));
      const index = currentSeaTurtleTags.findIndex(x => x.seaTurtleTagId === patchedSeaTurtleTag.seaTurtleTagId);
      if (~index) {
        currentSeaTurtleTags[index] = clone(patchedSeaTurtleTag);
      } else {
        currentSeaTurtleTags.push(patchedSeaTurtleTag);
      }
      setCurrentSeaTurtleTags(clone(currentSeaTurtleTags));
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
    reset(clone(currentSeaTurtleTag));
  };

  return (
    <Box id='seaTurtleTags'>
      <Spinner isActive={showSpinner} />
      <LeaveThisPagePrompt isDirty={formState.isDirty} />
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

      <Grid container justifyContent='center'>
        <Grid item xs={12} md={8}>
          <Typography variant='h1' align='center' gutterBottom={true}>Tags for {appContext.seaTurtle?.seaTurtleName}</Typography>

          <Grid container justifyContent='center' className={classes.formAddButtonsContainer}>
            <Grid item className={classes.formAddButtonContainer}>
              <Button className={classes.fixedWidthLarge} variant='contained' color='primary' type='button' 
                onClick={onAddSeaTurtleTagButtonClick} 
                startIcon={<Icon icon='add' />}
          >
                Add Tag
              </Button>
            </Grid>
          </Grid>

          <DisplayTable
            columns={tableColumns}
            data={currentSeaTurtleTags}
            defaultSortField="dateTagged"
            defaultSortAsc={false}
            onRowClicked={row => onEditSeaTurtleTagClick(row as SeaTurtleTagModel)}
            onDeleteClicked={row => onDeleteSeaTurtleTagClick(row as SeaTurtleTagModel)}
          />

          <Divider />

          <FormProvider {...methods} >
            <form onSubmit={onSubmit}>
              <fieldset disabled={!isFormEnabled}>
                <FormFieldRow>
                  <TextFormField fieldName='tagNumber' labelText='Tag Number' validationRules={{ required: 'Tag Number is required' }} refObject={firstEditControlRef} disabled={!isFormEnabled} />
                  <ListFormField fieldName='tagType' labelText='Tag Type' listItems={tagTypes} disabled={!isFormEnabled} />
                  <ListFormField fieldName='location' labelText='Location' listItems={locations} disabled={!isFormEnabled} />
                  <DateFormField fieldName='dateTagged' labelText='Date Tagged' disabled={!isFormEnabled} />
                </FormFieldRow>

                <Box className={classes.formActionButtonsContainer}>
                  <Button className={clsx(classes.fixedWidthMedium, classes.saveButton)} variant='contained' type='submit' disabled={!(formState.isValid && formState.isDirty)}>
                    Save
                  </Button>
                  <Button className={classes.fixedWidthMedium} variant='contained' color='secondary' type='button' onClick={() => onCancelClick()} disabled={!formState.isDirty}>
                    Cancel
                  </Button>
                </Box>
              </fieldset>
            </form>
          </FormProvider>

        </Grid>
      </Grid>
    </Box>
  );
};

export default SeaTurtleTags;
