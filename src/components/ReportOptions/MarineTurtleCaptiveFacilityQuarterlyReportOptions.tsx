import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import TextareaFormField from 'components/FormFields/TextareaFormField';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import ReportListItemModel from 'models/ReportListItemModel';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import ReportOptionsDateRange, { ReportQuarter } from './ReportOptionsDateRange';
import './ReportOptionsFormFields.sass';

const MarineTurtleCaptiveFacilityQuarterlyReportOptions: React.FC<{currentReportListItem: ReportListItemModel}> = ({currentReportListItem}) => {
  const [appContext] = useAppContext();
  const { reset } = useFormContext();
    
  useMount(() => {
    reset(appContext.reportOptions[currentReportListItem.reportId]);
  });

  return (
    <>
      <FormFieldRow>
        <ReportOptionsDateRange reportQuarter={ReportQuarter.Current} />
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
