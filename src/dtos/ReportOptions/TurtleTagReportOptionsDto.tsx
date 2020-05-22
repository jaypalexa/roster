export default interface TurtleTagReportOptionsDto {
  [key: string]: any;
  dateFrom: string;
  dateThru: string;
  filterDateType: string; // dateAcquired | dateTagged | dateRelinquished
  includeNonRelinquishedTurtles: boolean;
  includeStrandingIdNumber: boolean;
  isPit: boolean;
  isLff: boolean;
  isRff: boolean;
  isLrf: boolean;
  isRrf: boolean;
};
