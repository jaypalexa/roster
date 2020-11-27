import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import TextareaFormField from 'components/FormFields/TextareaFormField';
import { useAppContext } from 'contexts/AppContext';
import ReportDefinitionModel from 'models/ReportDefinitionModel';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import ReportOptionsDateRange from './ReportOptionsDateRange';

const MarineTurtleCaptiveFacilityQuarterlyReportOptions: React.FC<{reportDefinition: ReportDefinitionModel}> = ({reportDefinition}) => {
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
        <TextareaFormField fieldName='comments' labelText='Comments' />
      </FormFieldRow>
      <FormFieldRow>
        <CheckboxFormField fieldName='includeDoaCounts' labelText='Include DOA counts by species for this period' />
      </FormFieldRow>
    </>
  );
};

export default MarineTurtleCaptiveFacilityQuarterlyReportOptions;
