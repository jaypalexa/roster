import FormFieldRowMui from 'components/FormFields/FormFieldRowMui';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import ReportDefinitionModel from 'models/ReportDefinitionModel';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import ReportOptionsDateRange from './ReportOptionsDateRange';
import './ReportOptionsFormFields.sass';

const HatchlingsAndWashbacksByCountyReportOptions: React.FC<{reportDefinition: ReportDefinitionModel}> = ({reportDefinition}) => {
  const [appContext] = useAppContext();
  const { reset } = useFormContext();
    
  useMount(() => {
    reset(appContext.reportOptions[reportDefinition.reportId]);
  });

  return (
    <FormFieldRowMui>
      <ReportOptionsDateRange />
    </FormFieldRowMui>
  );
};

export default HatchlingsAndWashbacksByCountyReportOptions;
