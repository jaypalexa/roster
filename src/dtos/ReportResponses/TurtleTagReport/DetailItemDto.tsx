import DetailItemTagDto from './DetailItemTagDto';

export default interface DetailItemDto {
  [key: string]: any;
  seaTurtleId: string;
  sidNumber: string;
  seaTurtleName: string;
  dateRelinquished: string;
  strandingIdNumber: string;
  tags: DetailItemTagDto[];
};
