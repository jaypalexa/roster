import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import CheckboxGroupFormField from 'components/FormFields/CheckboxGroupFormField';
import FormFieldRowMui from 'components/FormFields/FormFieldRow';
import RadioButtonFormField from 'components/FormFields/RadioButtonFormField';
import RadioButtonGroupFormField from 'components/FormFields/RadioButtonGroupFormField';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import ReportDefinitionModel from 'models/ReportDefinitionModel';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import ReportOptionsDateRange from './ReportOptionsDateRange';
import './ReportOptionsFormFields.sass';

const TurtleTagReportOptions: React.FC<{reportDefinition: ReportDefinitionModel}> = ({reportDefinition}) => {
  const [appContext] = useAppContext();
  const { reset } = useFormContext();
    
  useMount(() => {
    reset(appContext.reportOptions[reportDefinition.reportId]);
  });

  return (
    <>
      <FormFieldRowMui>
        <ReportOptionsDateRange />
      </FormFieldRowMui>
      <FormFieldRowMui>
        <RadioButtonGroupFormField fieldName='filterDateType' labelText='Date type'>
          <RadioButtonFormField labelText='Date acquired' value='dateAcquired' />
          <RadioButtonFormField labelText='Date tagged' value='dateTagged' />
          <RadioButtonFormField labelText='Date relinquished' value='dateRelinquished' />
          <div className='turtle-tag-report-options include-non-relinquished-turtles'>
            <CheckboxFormField fieldName='includeNonRelinquishedTurtles' labelText='Include non-relinquished turtles' />
          </div>
        </RadioButtonGroupFormField>
      </FormFieldRowMui>
      
      <FormFieldRowMui>
        <CheckboxGroupFormField labelText='Options'>
          <CheckboxFormField fieldName='includeStrandingIdNumber' labelText='Include Stranding ID number' />
        </CheckboxGroupFormField>
      </FormFieldRowMui>

      <FormFieldRowMui>
        <CheckboxGroupFormField labelText='Tag type'>
          <CheckboxFormField fieldName='isPit' labelText='Include PIT?' />
        </CheckboxGroupFormField>
      </FormFieldRowMui>

      <FormFieldRowMui>
        <CheckboxGroupFormField labelText='Tag location'>
          <CheckboxFormField fieldName='isLff' labelText='Include LFF?' />
          <CheckboxFormField fieldName='isRff' labelText='Include RFF?' />
          <CheckboxFormField fieldName='isLrf' labelText='Include LRF?' />
          <CheckboxFormField fieldName='isRrf' labelText='Include RRF?' />
        </CheckboxGroupFormField>
      </FormFieldRowMui>
    </>
  );
};

export default TurtleTagReportOptions;
