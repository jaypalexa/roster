export default interface ReportDefinitionModel {
  [key: string]: any;
  reportId: string;
  reportName: string;
  canGenerate: boolean;
  isPdf: boolean;
  blankFileName?: string;
};
