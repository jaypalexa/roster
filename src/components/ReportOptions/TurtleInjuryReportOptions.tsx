import FormFieldRow from 'components/FormFields/FormFieldRow';
import { useAppContext } from 'contexts/AppContext';
import ReportDefinitionModel from 'models/ReportDefinitionModel';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import ReportOptionsDateRange from './ReportOptionsDateRange';

const TurtleInjuryReportOptions: React.FC<{reportDefinition: ReportDefinitionModel}> = ({reportDefinition}) => {
  const [appContext] = useAppContext();
  const { reset } = useFormContext();
    
  useEffect(() => {
    reset(appContext.reportOptions[reportDefinition.reportId]);
  }, [reset, appContext.reportOptions, reportDefinition.reportId]);

  return (
    <FormFieldRow>
      <ReportOptionsDateRange />
    </FormFieldRow>
  );
};

export default TurtleInjuryReportOptions;
