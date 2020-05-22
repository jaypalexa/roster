import ReportDefinitionModel from "./ReportDefinitionModel";

export default interface ReportRouteStateModel {
  [key: string]: any;
  reportDefinition: ReportDefinitionModel;
  reportOptions: any;
};
