import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import FormFieldGroup from 'components/FormFields/FormFieldGroup';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import RadioButtonFormField from 'components/FormFields/RadioButtonFormField';
import RadioButtonGroupFormField from 'components/FormFields/RadioButtonGroupFormField';
import React from 'react';
import './ReportOptions.sass';
import ReportOptionsDateRange, { ReportQuarter } from './ReportOptionsDateRange';

const MarineTurtleHoldingFacilityQuarterlyReportOptions: React.FC = () => {
  return (
    <div id='reportOptionsControls'>
      <FormFieldRow>
        <ReportOptionsDateRange reportQuarter={ReportQuarter.Current} />
      </FormFieldRow>
      <FormFieldRow>
        <FormFieldGroup fieldClass='checkbox-group checkboxes-3' labelText='Options'>
          <CheckboxFormField fieldName='includeAnomalies' labelText='Include anomalies' />
          <CheckboxFormField fieldName='includeAcquiredFrom' labelText='Include acquired from' />
          <CheckboxFormField fieldName='includeTurtleName' labelText='Include turtle name in SID # box' />
        </FormFieldGroup>
        <RadioButtonGroupFormField fieldName='groupTankDataBy' labelText='Group tank data by' >
          <RadioButtonFormField fieldName='groupTankDataBy' labelText='Tank' value='tank' defaultChecked={true} />
          <br />
          <RadioButtonFormField fieldName='groupTankDataBy' labelText='Date' value='date' />
        </RadioButtonGroupFormField>
      </FormFieldRow>
    </div>
  );
};

export default MarineTurtleHoldingFacilityQuarterlyReportOptions;
