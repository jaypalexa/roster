import DateFormField from 'components/FormFields/DateFormField';
import React from 'react';

const ReportOptionsDateRange: React.FC = () => {

  return (
    <>
      <DateFormField fieldName='dateFrom' labelText='Date from' />
      <DateFormField fieldName='dateThru' labelText='Date thru' />
    </>
  );
};

export default ReportOptionsDateRange;
