import ReportDefinitionModel from "./ReportDefinitionModel";

export default class ReportRouteStateModel {
  [key: string]: any;
  reportDefinition!: ReportDefinitionModel;
  reportOptions: any;
  
  constructor() {
    // booleans:  need to be initialized to true or false for controlled checkboxes
    // strings for list items:  need to be initialized to empty string to clear listbox (input select)
  }
};
