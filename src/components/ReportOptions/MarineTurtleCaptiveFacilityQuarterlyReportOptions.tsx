import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import FormFieldRowMui from 'components/FormFields/FormFieldRowMui';
import TextareaFormFieldMui from 'components/FormFields/TextareaFormFieldMui';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import ReportDefinitionModel from 'models/ReportDefinitionModel';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import ReportOptionsDateRange from './ReportOptionsDateRange';
import './ReportOptionsFormFields.sass';

const MarineTurtleCaptiveFacilityQuarterlyReportOptions: React.FC<{reportDefinition: ReportDefinitionModel}> = ({reportDefinition}) => {
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
        <TextareaFormFieldMui fieldName='comments' labelText='Comments' />
      </FormFieldRowMui>
      <FormFieldRowMui>
        <CheckboxFormField fieldName='includeDoaCounts' labelText='Include DOA counts by species for this period' />
      </FormFieldRowMui>
    </>
  );
};

export default MarineTurtleCaptiveFacilityQuarterlyReportOptions;
