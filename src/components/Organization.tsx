import { Box, Breadcrumbs, Button, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import clsx from 'clsx';
import DateFormField from 'components/FormFields/DateFormField';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import IntegerFormField from 'components/FormFields/IntegerFormField';
import RadioButtonFormField from 'components/FormFields/RadioButtonFormField';
import RadioButtonGroupFormField from 'components/FormFields/RadioButtonGroupFormField';
import TextFormField from 'components/FormFields/TextFormField';
import LeaveThisPagePrompt from 'components/LeaveThisPagePrompt';
import Spinner from 'components/Spinner/Spinner';
import TabPanel, { a11yProps } from 'components/TabPanel';
import useMount from 'hooks/UseMount';
import OrganizationModel from 'models/OrganizationModel';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import OrganizationService from 'services/OrganizationService';
import ToastService from 'services/ToastService';
import sharedStyles from 'styles/sharedStyles';
import { clone, constants } from 'utils';

const Organization: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(sharedStyles(theme))
  );
  const classes = useStyles();

  const methods = useForm<OrganizationModel>({ mode: 'onChange', defaultValues: new OrganizationModel(), shouldUnregister: false });
  const { handleSubmit, formState, reset } = methods;
  const [currentOrganization, setCurrentOrganization] = useState(new OrganizationModel());
  const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
  const [showSpinner, setShowSpinner] = useState(false);

  /* scroll to top */
  useMount(() => {
    window.scrollTo(0, 0);
  });

  /* fetch table data */
  useMount(() => {
    const fetchOrganization = async () => {
      try {
        setShowSpinner(true);
        const organization = await OrganizationService.getOrganization();
        reset(organization);
        setCurrentOrganization(clone(organization));
      } 
      catch (err) {
        console.log(err);
        ToastService.error(constants.ERROR.GENERIC);
      }
      finally {
        setShowSpinner(false);
      }
    };
    fetchOrganization();
  });

  const onTabChange = (event: React.ChangeEvent<{}>, newIndex: number) => {
    setCurrentTabIndex(newIndex);
  };

  const onSubmit = handleSubmit(async (modifiedOrganization: OrganizationModel) => {
    if (!formState.isDirty) return;

    await saveOrganization(modifiedOrganization);
    ToastService.success('Record saved');
  });

  const saveOrganization = async (modifiedOrganization: OrganizationModel) => {
    try {
      setShowSpinner(true);
      const patchedOrganization = { ...currentOrganization, ...modifiedOrganization };
      await OrganizationService.saveOrganization(patchedOrganization);
      reset(patchedOrganization);
      setCurrentOrganization(clone(patchedOrganization));
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
    reset(clone(currentOrganization));
  };

  return (
    <Box id='organization'>
      <Spinner isActive={showSpinner} />
      <LeaveThisPagePrompt isDirty={formState.isDirty} />
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenMobile}>
        <Link to='/'>Home</Link>
        <Typography color='textPrimary'>Organization</Typography>
      </Breadcrumbs>
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenNotMobile}>
        <Link to='/'>&#10094; Home</Link>
      </Breadcrumbs>

      <Grid container justify='center'>
        <Grid item xs={12} md={8}>
          <Typography variant='h1' align='center' gutterBottom={true}>Organization</Typography>
          <FormProvider {...methods} >
            <form onSubmit={onSubmit}>

              <Tabs
                value={currentTabIndex}
                onChange={onTabChange}
                indicatorColor='primary'
                textColor='primary'
                variant='scrollable'
                scrollButtons='auto'
                aria-label='Organization Tabs'
              >
                <Tab className={classes.tabButton} label='General Information' {...a11yProps(0)} />
                <Tab className={classes.tabButton} label='Hatchling and Washback Starting Balances' {...a11yProps(1)} />
                <Tab className={classes.tabButton} label='Preferences' {...a11yProps(2)} />
              </Tabs>

              <TabPanel value={currentTabIndex} index={0}> {/* General Information */}
                <FormFieldRow>
                  <TextFormField fieldName='organizationName' labelText='Organization Name' validationRules={{ required: 'Organization Name is required' }} />
                  <TextFormField fieldName='permitNumber' labelText='Permit Number' />
                  <TextFormField fieldName='contactName' labelText='Contact Name' />
                </FormFieldRow>

                <FormFieldRow>
                  <TextFormField fieldName='address1' labelText='Address Line 1' />
                  <TextFormField fieldName='address2' labelText='Address Line 2' />
                </FormFieldRow>

                <FormFieldRow>
                  <TextFormField fieldName='city' labelText='City' />
                  <TextFormField fieldName='state' labelText='State' value='Florida' disabled={true} />
                  <TextFormField fieldName='zipCode' labelText='ZIP Code' maxLength={10} validationRules={{ maxLength: { value: 10, message: 'ZIP Code cannot exceed 10 characters' } }} />
                </FormFieldRow>

                <FormFieldRow>
                  <TextFormField fieldName='phone' labelText='Phone' />
                  <TextFormField fieldName='fax' labelText='Fax' />
                  <TextFormField fieldName='emailAddress' labelText='Email Address'
                    validationRules={{
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: 'Invalid email address'
                      }
                    }}
                  />
                </FormFieldRow>
              </TabPanel>
              <TabPanel value={currentTabIndex} index={1}> {/* Hatchling and Washback Starting Balances */}
                <Grid container justify='center' spacing={2}>
                  <Grid item md={6}>
                    <Typography variant='h2' align='center' gutterBottom={true}>Hatchlings</Typography>
                    <DateFormField fieldName='hatchlingsBalanceAsOfDate' labelText='Balance As Of' />
                    <IntegerFormField fieldName='ccHatchlingsStartingBalance' labelText='Loggerhead (Cc)' />
                    <IntegerFormField fieldName='cmHatchlingsStartingBalance' labelText='Green (Cm)' />
                    <IntegerFormField fieldName='dcHatchlingsStartingBalance' labelText='Leatherback (Dc)' />
                    <IntegerFormField fieldName='otherHatchlingsStartingBalance' labelText='Other' />
                    <IntegerFormField fieldName='unknownHatchlingsStartingBalance' labelText='Unknown' />
                  </Grid>
                  <Grid item md={6}>
                    <Typography variant='h2' align='center' gutterBottom={true}>Washbacks</Typography>
                    <DateFormField fieldName='washbacksBalanceAsOfDate' labelText='Balance As Of' />
                    <IntegerFormField fieldName='ccWashbacksStartingBalance' labelText='Loggerhead (Cc)' />
                    <IntegerFormField fieldName='cmWashbacksStartingBalance' labelText='Green (Cm)' />
                    <IntegerFormField fieldName='dcWashbacksStartingBalance' labelText='Leatherback (Dc)' />
                    <IntegerFormField fieldName='otherWashbacksStartingBalance' labelText='Other' />
                    <IntegerFormField fieldName='unknownWashbacksStartingBalance' labelText='Unknown' />
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={currentTabIndex} index={2}> {/* Preferences */}
                <RadioButtonGroupFormField fieldName='preferredUnitsType' labelText='Units Type' >
                  <RadioButtonFormField labelText='Metric' value='M' />
                  <RadioButtonFormField labelText='Imperial' value='I' />
                </RadioButtonGroupFormField>
              </TabPanel>

              <Box className={classes.formActionButtonsContainer}>
                <Button className={clsx(classes.fixedWidthMedium, classes.saveButton)} variant='contained' type='submit' disabled={!(formState.isValid && formState.isDirty)}>
                  Save
                </Button>
                <Button className={classes.fixedWidthMedium} variant='contained' color='secondary' type='button' onClick={() => onCancelClick()} disabled={!formState.isDirty}>
                  Cancel
                </Button>
              </Box>
            </form>
          </FormProvider>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Organization;
