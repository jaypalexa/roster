export default class SeaTurtleTagModel {
  [key: string]: any;
  seaTurtleTagId!: string;
  seaTurtleId!: string;
  tagNumber!: string;
  tagType!: string;
  location!: string;
  dateTagged!: Date;
  
  constructor() {
    // booleans:  need to be initialized to true or false for controlled checkboxes
    // strings for list items:  need to be initialized to empty string to clear listbox (input select)
    this.tagType = '';
  }
};
