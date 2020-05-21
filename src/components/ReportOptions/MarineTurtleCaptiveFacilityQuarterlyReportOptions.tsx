import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import TextareaFormField from 'components/FormFields/TextareaFormField';
import React from 'react';
import ReportOptionsDateRange, { ReportQuarter } from './ReportOptionsDateRange';
import './ReportOptionsFormFields.sass';

const MarineTurtleCaptiveFacilityQuarterlyReportOptions: React.FC = () => {
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
