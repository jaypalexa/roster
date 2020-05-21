import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import FormFieldGroup from 'components/FormFields/FormFieldGroup';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import RadioButtonFormField from 'components/FormFields/RadioButtonFormField';
import RadioButtonGroupFormField from 'components/FormFields/RadioButtonGroupFormField';
import React from 'react';
import ReportOptionsDateRange, { ReportQuarter } from './ReportOptionsDateRange';
import './ReportOptionsFormFields.sass';

const TurtleTagReportOptions: React.FC = () => {
  return (
    <>
      <FormFieldRow>
        <ReportOptionsDateRange reportQuarter={ReportQuarter.Previous} />
      </FormFieldRow>
      <FormFieldRow>
        <RadioButtonGroupFormField fieldName='filterDateType' labelText='Date type' >
          <RadioButtonFormField fieldName='filterDateType' labelText='Date acquired' value='dateTypeAcquired' defaultChecked={true} />
          <br />
          <RadioButtonFormField fieldName='filterDateType' labelText='Date tagged' value='dateTypeTagged' />
          <br />
          <RadioButtonFormField fieldName='filterDateType' labelText='Date relinquished' value='dateTypeRelinquished' />
          <div className='turtle-tag-report-options include-non-relinquished-turtles'>
            <CheckboxFormField fieldName='includeNonRelinquishedTurtles' labelText='Include non-relinquished turtles' defaultChecked={true} />
          </div>
        </RadioButtonGroupFormField>
        <FormFieldGroup fieldClass='checkbox-group checkboxes-2' labelText='Options'>
          <CheckboxFormField fieldName='includeStrandingIdNumber' labelText='Include Stranding ID number' defaultChecked={true} />
        </FormFieldGroup>
      </FormFieldRow>
      <FormFieldRow>
        <FormFieldGroup fieldClass='checkbox-group checkboxes-1' labelText='Tag type'>
          <CheckboxFormField fieldName='isPit' labelText='PIT' defaultChecked={true} />
        </FormFieldGroup>
        <FormFieldGroup fieldClass='checkbox-group checkboxes-2' labelText='Flipper tags'>
          <CheckboxFormField fieldName='isLff' labelText='LFF' defaultChecked={true} />
          <CheckboxFormField fieldName='isRff' labelText='RFF' defaultChecked={true} />
          <CheckboxFormField fieldName='isLrf' labelText='LRF' defaultChecked={true} />
          <CheckboxFormField fieldName='isRrf' labelText='RRF' defaultChecked={true} />
        </FormFieldGroup>
      </FormFieldRow>
    </>
  );
};

export default TurtleTagReportOptions;
