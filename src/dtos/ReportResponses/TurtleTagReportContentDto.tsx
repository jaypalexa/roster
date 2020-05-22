import TurtleTagReportDetailItemDto from './TurtleTagReportDetailItemDto';

export default interface TurtleTagReportContentDto {
  [key: string]: any;
  detailItems: TurtleTagReportDetailItemDto[];
};
