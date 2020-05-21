import FormFieldRow from 'components/FormFields/FormFieldRow';
import React from 'react';
import ReportOptionsDateRange, { ReportQuarter } from './ReportOptionsDateRange';
import './ReportOptionsFormFields.sass';

const HatchlingsAndWashbacksByCountyReportOptions: React.FC = () => {
  return (
    <>
      <FormFieldRow>
        <ReportOptionsDateRange reportQuarter={ReportQuarter.Previous} />
      </FormFieldRow>
    </>
  );
};

export default HatchlingsAndWashbacksByCountyReportOptions;
