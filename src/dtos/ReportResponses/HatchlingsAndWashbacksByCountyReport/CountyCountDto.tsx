import DetailItemDto from './DetailItemDto';
import PercentageOfGrandTotalDto from './PercentageOfGrandTotalDto';

export default interface CountyCountDto {
  [key: string]: any;
  countyName: string;
  ccCount: DetailItemDto;
  cmCount: DetailItemDto;
  dcCount: DetailItemDto;
  otherCount: DetailItemDto;
  unknownCount: DetailItemDto;
  totalCount: DetailItemDto;
  percentageOfGrandTotal : PercentageOfGrandTotalDto;
};
