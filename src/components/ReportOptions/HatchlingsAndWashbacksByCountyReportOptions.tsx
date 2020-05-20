import FormFieldRow from 'components/FormFields/FormFieldRow';
import React from 'react';
import './ReportOptions.sass';
import ReportOptionsDateRange, { ReportQuarter } from './ReportOptionsDateRange';

const HatchlingsAndWashbacksByCountyReportOptions: React.FC = () => {
  return (
    <div id='reportOptionsControls'>
      <FormFieldRow>
        <ReportOptionsDateRange reportQuarter={ReportQuarter.Previous} />
      </FormFieldRow>
    </div>
  );
};

export default HatchlingsAndWashbacksByCountyReportOptions;
