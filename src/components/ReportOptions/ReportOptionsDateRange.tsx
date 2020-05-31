import DateFormFieldMui from 'components/FormFields/DateFormFieldMui';
import React from 'react';

const ReportOptionsDateRange: React.FC = () => {

  return (
    <>
      <DateFormFieldMui fieldName='dateFrom' labelText='Date from' />
      <DateFormFieldMui fieldName='dateThru' labelText='Date thru' />
    </>
  );
};

export default ReportOptionsDateRange;
