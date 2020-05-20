import DateFormField from 'components/FormFields/DateFormField';
import useMount from 'hooks/UseMount';
import moment from 'moment';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import './ReportOptionsDateRange.sass';

export enum ReportQuarter {
  Previous = 1,
  Current = 2,
}

interface ReportOptionsDateRangeProps {
  reportQuarter?: ReportQuarter;
}

const ReportOptionsDateRange: React.FC<ReportOptionsDateRangeProps> = ({reportQuarter}) => {
  const { reset } = useFormContext();

  const convertDateToYyyyMmDdString = (dateValue: Date) => {
    return new Date(dateValue.getTime() - (dateValue.getTimezoneOffset() * 60000 )).toISOString().split('T')[0];
  };

  useMount(() => {
    /* set initial (quarterly) date range; last quarter or current quarter */
    const offset = (reportQuarter === ReportQuarter.Previous) ? -3 : 0;
    var seedDate = moment().add(offset, 'month').toDate();
    var quarter = Math.floor((seedDate.getMonth() / 3));
    var dateFrom = new Date(seedDate.getFullYear(), quarter * 3, 1);
    var dateThru = new Date(dateFrom.getFullYear(), dateFrom.getMonth() + 3, 0);
    reset({dateFrom: convertDateToYyyyMmDdString(dateFrom), dateThru: convertDateToYyyyMmDdString(dateThru)});
  });
  
  return (
    <>
      <DateFormField fieldName='dateFrom' labelText='Date from' />
      <DateFormField fieldName='dateThru' labelText='Date thru' />
    </>
  );
};

export default ReportOptionsDateRange;
