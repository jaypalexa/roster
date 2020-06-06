import { Box, Breadcrumbs, Button, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import clsx from 'clsx';
import DateFormFieldMui from 'components/FormFields/DateFormFieldMui';
import FormFieldRowMui from 'components/FormFields/FormFieldRowMui';
import IntegerFormFieldMui from 'components/FormFields/IntegerFormFieldMui';
import RadioButtonFormFieldMui from 'components/FormFields/RadioButtonFormFieldMui';
import RadioButtonGroupFormFieldMui from 'components/FormFields/RadioButtonGroupFormFieldMui';
import TextFormFieldMui from 'components/FormFields/TextFormFieldMui';
import LeaveThisPagePrompt from 'components/LeaveThisPagePrompt/LeaveThisPagePrompt';
import Spinner from 'components/Spinner/Spinner';
import TabPanel, { a11yProps } from 'components/TabPanel/TabPanel';
import useMount from 'hooks/UseMount';
import OrganizationModel from 'models/OrganizationModel';
import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import OrganizationService from 'services/OrganizationService';
import ToastService from 'services/ToastService';
import sharedStyles from 'styles/sharedStyles';
import { constants } from 'utils';

const OrganizationMui: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(sharedStyles(theme))
  );
  const classes = useStyles();

  const methods = useForm<OrganizationModel>({ mode: 'onChange' });
  const {  handleSubmit, formState, reset } = methods;
  const [currentOrganization, setCurrentOrganization] = useState({} as OrganizationModel);
  const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
  const [showSpinner, setShowSpinner] = useState(false);

  useMount(() => {
    window.scrollTo(0, 0);
  });

  useMount(() => {

    const fetchOrganization = async () => {
      try {
        setShowSpinner(true);
        const organization = await OrganizationService.getOrganization();
        reset(organization);
        setCurrentOrganization(organization);
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

  const onSubmit = handleSubmit((modifiedOrganization: OrganizationModel) => {
    const patchedOrganization = { ...currentOrganization, ...modifiedOrganization };
    OrganizationService.saveOrganization(patchedOrganization);
    reset(patchedOrganization);
    setCurrentOrganization(patchedOrganization);
    ToastService.success('Record saved');
  });

  const onCancelClick = () => {
    reset(currentOrganization);
  };

  return (
    <Box id='organization'>
      <Spinner isActive={showSpinner} />
      <LeaveThisPagePrompt isDirty={formState.dirty} />
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
          <FormContext {...methods} >
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
                <FormFieldRowMui>
                  <TextFormFieldMui fieldName='organizationName' labelText='Organization Name' validationOptions={{ required: 'Organization Name is required' }} />
                  <TextFormFieldMui fieldName='permitNumber' labelText='Permit Number' />
                  <TextFormFieldMui fieldName='contactName' labelText='Contact Name' />
                </FormFieldRowMui>

                <FormFieldRowMui>
                  <TextFormFieldMui fieldName='address1' labelText='Address Line 1' />
                  <TextFormFieldMui fieldName='address2' labelText='Address Line 2' />
                </FormFieldRowMui>

                <FormFieldRowMui>
                  <TextFormFieldMui fieldName='city' labelText='City' />
                  <TextFormFieldMui fieldName='state' labelText='State' value='Florida' disabled={true} />
                  <TextFormFieldMui fieldName='zipCode' labelText='ZIP Code' maxLength={10} validationOptions={{ maxLength: { value: 10, message: 'ZIP Code cannot exceed 10 characters' } }} />
                </FormFieldRowMui>

                <FormFieldRowMui>
                  <TextFormFieldMui fieldName='phone' labelText='Phone' />
                  <TextFormFieldMui fieldName='fax' labelText='Fax' />
                  <TextFormFieldMui fieldName='emailAddress' labelText='Email Address'
                    validationOptions={{
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: 'Invalid email address'
                      }
                    }}
                  />
                </FormFieldRowMui>
              </TabPanel>
              <TabPanel value={currentTabIndex} index={1}> {/* Hatchling and Washback Starting Balances */}
                <Grid container justify='center' spacing={2}>
                  <Grid item md={6}>
                    <Typography variant='h2' align='center' gutterBottom={true}>Hatchlings</Typography>
                    <DateFormFieldMui fieldName='hatchlingsBalanceAsOfDate' labelText='Balance As Of' />
                    <IntegerFormFieldMui fieldName='ccHatchlingsStartingBalance' labelText='Loggerhead (Cc)' />
                    <IntegerFormFieldMui fieldName='cmHatchlingsStartingBalance' labelText='Green (Cm)' />
                    <IntegerFormFieldMui fieldName='dcHatchlingsStartingBalance' labelText='Leatherback (Dc)' />
                    <IntegerFormFieldMui fieldName='otherHatchlingsStartingBalance' labelText='Other' />
                    <IntegerFormFieldMui fieldName='unknownHatchlingsStartingBalance' labelText='Unknown' />
                  </Grid>
                  <Grid item md={6}>
                    <Typography variant='h2' align='center' gutterBottom={true}>Washbacks</Typography>
                    <DateFormFieldMui fieldName='washbacksBalanceAsOfDate' labelText='Balance As Of' />
                    <IntegerFormFieldMui fieldName='ccWashbacksStartingBalance' labelText='Loggerhead (Cc)' />
                    <IntegerFormFieldMui fieldName='cmWashbacksStartingBalance' labelText='Green (Cm)' />
                    <IntegerFormFieldMui fieldName='dcWashbacksStartingBalance' labelText='Leatherback (Dc)' />
                    <IntegerFormFieldMui fieldName='otherWashbacksStartingBalance' labelText='Other' />
                    <IntegerFormFieldMui fieldName='unknownWashbacksStartingBalance' labelText='Unknown' />
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={currentTabIndex} index={2}> {/* Preferences */}
                <RadioButtonGroupFormFieldMui fieldName='preferredUnitsType' labelText='Units Type' >
                  <RadioButtonFormFieldMui labelText='Metric' value='M' />
                  <RadioButtonFormFieldMui labelText='Imperial' value='I' />
                </RadioButtonGroupFormFieldMui>
              </TabPanel>

              <Box className={classes.formActionButtonsContainer}>
                <Button className={clsx(classes.fixedWidthMedium, classes.saveButton)} variant='contained' type='submit' disabled={!(formState.isValid && formState.dirty)}>
                  Save
                </Button>
                <Button className={classes.fixedWidthMedium} variant='contained' color='secondary' type='button' onClick={() => onCancelClick()} disabled={!formState.dirty}>
                  Cancel
                </Button>
              </Box>
            </form>
          </FormContext>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrganizationMui;
