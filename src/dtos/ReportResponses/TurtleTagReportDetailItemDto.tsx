import TurtleTagReportDetailItemTagDto from './TurtleTagReportDetailItemTagDto';

export default interface TurtleTagReportDetailItemDto {
  [key: string]: any;
  seaTurtleId: string;
  sidNumber: string;
  seaTurtleName: string;
  dateRelinquished: string;
  strandingIdNumber: string;
  tags: TurtleTagReportDetailItemTagDto[];
};
