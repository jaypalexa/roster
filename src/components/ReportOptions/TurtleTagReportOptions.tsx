import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import FormFieldGroup from 'components/FormFields/FormFieldGroup';
import FormFieldRowMui from 'components/FormFields/FormFieldRowMui';
import RadioButtonFormFieldMui from 'components/FormFields/RadioButtonFormFieldMui';
import RadioButtonGroupFormFieldMui from 'components/FormFields/RadioButtonGroupFormFieldMui';
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
        <RadioButtonGroupFormFieldMui fieldName='filterDateType' labelText='Date type'>
          <RadioButtonFormFieldMui labelText='Date acquired' value='dateAcquired' />
          <RadioButtonFormFieldMui labelText='Date tagged' value='dateTagged' />
          <RadioButtonFormFieldMui labelText='Date relinquished' value='dateRelinquished' />
          <div className='turtle-tag-report-options include-non-relinquished-turtles'>
            <CheckboxFormField fieldName='includeNonRelinquishedTurtles' labelText='Include non-relinquished turtles' defaultChecked={true} />
          </div>
        </RadioButtonGroupFormFieldMui>
      </FormFieldRowMui>
      
      <FormFieldRowMui>
        <FormFieldGroup fieldClass='checkbox-group' labelText='Options'>
          <CheckboxFormField fieldName='includeStrandingIdNumber' labelText='Include Stranding ID number' defaultChecked={true} />
        </FormFieldGroup>
      </FormFieldRowMui>

      <FormFieldRowMui>
        <FormFieldGroup fieldClass='checkbox-group' labelText='Tag type'>
          <CheckboxFormField fieldName='isPit' labelText='Include PIT?' defaultChecked={true} />
        </FormFieldGroup>
      </FormFieldRowMui>

      <FormFieldRowMui>
        <FormFieldGroup fieldClass='checkbox-group' labelText='Tag location'>
          <CheckboxFormField fieldName='isLff' labelText='Include LFF?' defaultChecked={true} />
          <CheckboxFormField fieldName='isRff' labelText='Include RFF?' defaultChecked={true} />
          <CheckboxFormField fieldName='isLrf' labelText='Include LRF?' defaultChecked={true} />
          <CheckboxFormField fieldName='isRrf' labelText='Include RRF?' defaultChecked={true} />
        </FormFieldGroup>
      </FormFieldRowMui>
    </>
  );
};

export default TurtleTagReportOptions;
