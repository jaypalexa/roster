export default class ReportDefinitionModel {
  [key: string]: any;
  reportId!: string;
  reportName!: string;
  canGenerate!: boolean;
  isPdf!: boolean;
  blankFileName?: string;
  
  constructor() {
    // booleans:  need to be initialized to true or false for controlled checkboxes
    // strings for list items:  need to be initialized to empty string to clear listbox (input select)
    this.canGenerate = false;
    this.isPdf = false;
  }
};
