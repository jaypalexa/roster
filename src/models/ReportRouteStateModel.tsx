import ReportListItemModel from "./ReportListItemModel";

export default interface ReportRouteStateModel {
  [key: string]: any;
  currentReportListItem: ReportListItemModel;
  reportOptions: any;
};
