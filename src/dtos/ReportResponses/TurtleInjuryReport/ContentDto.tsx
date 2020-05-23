import DetailItemDto from './DetailItemDto';
import SummaryItemDto from './SummaryItemDto';

export default interface ContentDto {
  [key: string]: any;
  totalCount: number;
  summaryItems: SummaryItemDto[];
  detailItems: DetailItemDto[];
};
