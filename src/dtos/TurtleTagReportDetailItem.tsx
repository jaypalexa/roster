import TurtleTagReportDetailItemTag from './TurtleTagReportDetailItemTag';

export default interface TurtleTagReportDetailItem {
  [key: string]: any;
  seaTurtleId: string;
  sidNumber: string;
  seaTurtleName: string;
  dateRelinquished: string;
  strandingIdNumber: string;
  tags: TurtleTagReportDetailItemTag[];
};
