import ReportDefinitionModel from "./ReportDefinitionModel";

export default class ReportRouteStateModel {
  [key: string]: any;
  reportDefinition!: ReportDefinitionModel;
  reportOptions: any;
};
