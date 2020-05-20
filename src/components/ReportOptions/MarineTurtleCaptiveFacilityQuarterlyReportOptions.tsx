import CheckboxFormField from 'components/FormFields/CheckboxFormField';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import TextareaFormField from 'components/FormFields/TextareaFormField';
import React from 'react';
import './ReportOptions.sass';
import ReportOptionsDateRange, { ReportQuarter } from './ReportOptionsDateRange';

const MarineTurtleCaptiveFacilityQuarterlyReportOptions: React.FC = () => {
  return (
    <div id='reportOptionsControls'>
      <FormFieldRow>
        <ReportOptionsDateRange reportQuarter={ReportQuarter.Current} />
      </FormFieldRow>
      <FormFieldRow>
        <TextareaFormField fieldName='comments' labelText='Comments' />
      </FormFieldRow>
      <FormFieldRow>
        <CheckboxFormField fieldName='includeDoaCounts' labelText='Include DOA counts by species for this period' />
      </FormFieldRow>
    </div>
  );
};

export default MarineTurtleCaptiveFacilityQuarterlyReportOptions;
