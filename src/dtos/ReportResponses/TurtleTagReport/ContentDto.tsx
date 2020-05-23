import DetailItemDto from './DetailItemDto';

export default interface ContentDto {
  [key: string]: any;
  detailItems: DetailItemDto[];
};
