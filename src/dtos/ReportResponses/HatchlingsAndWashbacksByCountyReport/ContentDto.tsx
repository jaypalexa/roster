import CountyCountDto from './CountyCountDto';

export default interface ContentDto {
  [key: string]: any;
  countyCounts: CountyCountDto[];
};
