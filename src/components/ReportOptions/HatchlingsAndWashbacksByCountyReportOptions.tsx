import FormFieldRow from 'components/FormFields/FormFieldRow';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import ReportListItemModel from 'models/ReportListItemModel';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import ReportOptionsDateRange, { ReportQuarter } from './ReportOptionsDateRange';
import './ReportOptionsFormFields.sass';

const HatchlingsAndWashbacksByCountyReportOptions: React.FC<{currentReportListItem: ReportListItemModel}> = ({currentReportListItem}) => {
  const [appContext] = useAppContext();
  const { reset } = useFormContext();
    
  useMount(() => {
    reset(appContext.reportOptions[currentReportListItem.reportId]);
  });

  return (
    <>
      <FormFieldRow>
        <ReportOptionsDateRange reportQuarter={ReportQuarter.Previous} />
      </FormFieldRow>
    </>
  );
};

export default HatchlingsAndWashbacksByCountyReportOptions;
