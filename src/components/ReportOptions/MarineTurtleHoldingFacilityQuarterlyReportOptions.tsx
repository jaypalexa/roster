import CheckboxFormFieldMui from 'components/FormFields/CheckboxFormFieldMui';
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

const MarineTurtleHoldingFacilityQuarterlyReportOptions: React.FC<{reportDefinition: ReportDefinitionModel}> = ({reportDefinition}) => {
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
        <FormFieldGroup fieldClass='checkbox-group' labelText='Options'>
          <CheckboxFormFieldMui fieldName='includeAnomalies' labelText='Include anomalies' />
          <CheckboxFormFieldMui fieldName='includeAcquiredFrom' labelText='Include acquired from' />
          <CheckboxFormFieldMui fieldName='includeTurtleName' labelText='Include turtle name in SID # box' />
        </FormFieldGroup>
      </FormFieldRowMui>
      <FormFieldRowMui>
        <RadioButtonGroupFormFieldMui fieldName='groupTankDataBy' labelText='Group tank data by' >
          <RadioButtonFormFieldMui labelText='Tank' value='tank' />
          <RadioButtonFormFieldMui labelText='Date' value='date' />
        </RadioButtonGroupFormFieldMui>
      </FormFieldRowMui>
    </>
  );
};

export default MarineTurtleHoldingFacilityQuarterlyReportOptions;
