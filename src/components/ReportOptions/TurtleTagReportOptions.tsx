import { createStyles, makeStyles, Theme } from '@material-ui/core';
import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import CheckboxGroupFormField from 'components/FormFields/CheckboxGroupFormField';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import RadioButtonFormField from 'components/FormFields/RadioButtonFormField';
import RadioButtonGroupFormField from 'components/FormFields/RadioButtonGroupFormField';
import { useAppContext } from 'contexts/AppContext';
import ReportDefinitionModel from 'models/ReportDefinitionModel';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import sharedStyles from 'styles/sharedStyles';
import ReportOptionsDateRange from './ReportOptionsDateRange';

const TurtleTagReportOptions: React.FC<{reportDefinition: ReportDefinitionModel}> = ({reportDefinition}) => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      ...sharedStyles(theme),
      includeNonRelinquishedTurtles: {
        marginLeft: '1.5rem',
      }
    })
  );
  const classes = useStyles();

  const [appContext] = useAppContext();
  const { reset } = useFormContext();
    
  useEffect(() => {
    reset(appContext.reportOptions[reportDefinition.reportId]);
  }, [reset, appContext.reportOptions, reportDefinition.reportId]);

  return (
    <>
      <FormFieldRow>
        <ReportOptionsDateRange />
      </FormFieldRow>
      <FormFieldRow>
        <RadioButtonGroupFormField fieldName='filterDateType' labelText='Date type'>
          <RadioButtonFormField labelText='Date acquired' value='dateAcquired' />
          <RadioButtonFormField labelText='Date tagged' value='dateTagged' />
          <RadioButtonFormField labelText='Date relinquished' value='dateRelinquished' />
          <div className={classes.includeNonRelinquishedTurtles}>
            <CheckboxFormField fieldName='includeNonRelinquishedTurtles' labelText='Include non-relinquished turtles' />
          </div>
        </RadioButtonGroupFormField>
      </FormFieldRow>
      
      <FormFieldRow>
        <CheckboxGroupFormField labelText='Options'>
          <CheckboxFormField fieldName='includeStrandingIdNumber' labelText='Include Stranding ID number' />
        </CheckboxGroupFormField>
      </FormFieldRow>

      <FormFieldRow>
        <CheckboxGroupFormField labelText='Tag type'>
          <CheckboxFormField fieldName='isPit' labelText='Include PIT?' />
        </CheckboxGroupFormField>
      </FormFieldRow>

      <FormFieldRow>
        <CheckboxGroupFormField labelText='Tag location'>
          <CheckboxFormField fieldName='isLff' labelText='Include LFF?' />
          <CheckboxFormField fieldName='isRff' labelText='Include RFF?' />
          <CheckboxFormField fieldName='isLrf' labelText='Include LRF?' />
          <CheckboxFormField fieldName='isRrf' labelText='Include RRF?' />
        </CheckboxGroupFormField>
      </FormFieldRow>
    </>
  );
};

export default TurtleTagReportOptions;
