import HatchlingsAndWashbacksByCountyReportDetailItemDto from './HatchlingsAndWashbacksByCountyReportDetailItemDto';

export default interface HatchlingsAndWashbacksByCountyReportCountyCountDto {
  [key: string]: any;
  countyName: string;
  ccCount: HatchlingsAndWashbacksByCountyReportDetailItemDto;
  cmCount: HatchlingsAndWashbacksByCountyReportDetailItemDto;
  dcCount: HatchlingsAndWashbacksByCountyReportDetailItemDto;
  otherCount: HatchlingsAndWashbacksByCountyReportDetailItemDto;
  unknownCount: HatchlingsAndWashbacksByCountyReportDetailItemDto;
  totalCount: HatchlingsAndWashbacksByCountyReportDetailItemDto;
};
