export default class ReportModel {
  [key: string]: any;
  reportId!: string;
  reportName!: string;
  data!: string; // PDF content as a base64-encoded string
  url!: string;  // object URL created from blob
  
  constructor() {
    // booleans:  need to be initialized to true or false for controlled checkboxes
    // strings for list items:  need to be initialized to empty string to clear listbox (input select)
  }
};
