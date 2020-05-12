export default interface ReportListItemModel {
  [key: string]: any;
  reportId: string;
  reportName: string;
  canGenerate: boolean;
  isPdf: boolean;
  blankFileName?: string;
};
