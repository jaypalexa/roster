import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import FormFieldGroup from 'components/FormFields/FormFieldGroup';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import RadioButtonFormField from 'components/FormFields/RadioButtonFormField';
import RadioButtonGroupFormField from 'components/FormFields/RadioButtonGroupFormField';
import React from 'react';
import './ReportOptions.sass';
import ReportOptionsDateRange, { ReportQuarter } from './ReportOptionsDateRange';

const TurtleTagReportOptions: React.FC = () => {
  return (
    <div id='reportOptionsControls'>
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
        </RadioButtonGroupFormField>
        <FormFieldGroup fieldClass='checkbox-group checkboxes-2' labelText='Options'>
          <CheckboxFormField fieldName='includeNonRelinquishedTurtles' labelText='Include non-relinquished turtles' defaultChecked={true} />
          <CheckboxFormField fieldName='includeStrandingIdNumber' labelText='Include Stranding ID number' defaultChecked={true} />
        </FormFieldGroup>
      </FormFieldRow>
      <FormFieldRow>
        <FormFieldGroup fieldClass='checkbox-group checkboxes-1' labelText='Tag type'>
          <CheckboxFormField fieldName='isPit' labelText='PIT' defaultChecked={true} />
        </FormFieldGroup>
        <FormFieldGroup fieldClass='checkbox-group checkboxes-4' labelText='Flipper tags'>
          <CheckboxFormField fieldName='isLff' labelText='LFF' defaultChecked={true} />
          <CheckboxFormField fieldName='isRff' labelText='RFF' defaultChecked={true} />
          <CheckboxFormField fieldName='isLrf' labelText='LRF' defaultChecked={true} />
          <CheckboxFormField fieldName='isRrf' labelText='RRF' defaultChecked={true} />
        </FormFieldGroup>
      </FormFieldRow>
    </div>
  );
};

export default TurtleTagReportOptions;
