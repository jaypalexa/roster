import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import CheckboxGroupFormField from 'components/FormFields/CheckboxGroupFormField';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import RadioButtonFormField from 'components/FormFields/RadioButtonFormField';
import RadioButtonGroupFormField from 'components/FormFields/RadioButtonGroupFormField';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import ReportDefinitionModel from 'models/ReportDefinitionModel';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import ReportOptionsDateRange from './ReportOptionsDateRange';

const MarineTurtleHoldingFacilityQuarterlyReportOptions: React.FC<{reportDefinition: ReportDefinitionModel}> = ({reportDefinition}) => {
  const [appContext] = useAppContext();
  const { reset } = useFormContext();
    
  useMount(() => {
    reset(appContext.reportOptions[reportDefinition.reportId]);
  });

  return (
    <>
      <FormFieldRow>
        <ReportOptionsDateRange />
      </FormFieldRow>
      <FormFieldRow>
        <CheckboxGroupFormField labelText='Options'>
          <CheckboxFormField fieldName='includeAnomalies' labelText='Include anomalies' />
          <CheckboxFormField fieldName='includeAcquiredFrom' labelText='Include acquired from' />
          <CheckboxFormField fieldName='includeTurtleName' labelText='Include turtle name in SID # box' />
        </CheckboxGroupFormField>
      </FormFieldRow>
      <FormFieldRow>
        <RadioButtonGroupFormField fieldName='groupTankDataBy' labelText='Group tank data by' >
          <RadioButtonFormField labelText='Tank' value='tank' />
          <RadioButtonFormField labelText='Date' value='date' />
        </RadioButtonGroupFormField>
      </FormFieldRow>
    </>
  );
};

export default MarineTurtleHoldingFacilityQuarterlyReportOptions;
