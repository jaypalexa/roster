export default class SeaTurtleListItemModel {
  [key: string]: any;
  seaTurtleId!: string;
  organizationId!: string;
  seaTurtleName!: string;
  sidNumber!: string;
  species!: string;
  dateAcquired!: Date;
  acquiredCounty!: string;
  turtleSize!: string;
  status!: string;
  dateRelinquished!: Date;

  constructor() {
    // booleans:  need to be initialized to true or false for controlled checkboxes
    // strings for list items:  need to be initialized to empty string to clear listbox (input select)
    this.species = '';
    this.acquiredCounty = '';
    this.turtleSize = '';
    this.status = '';
  }
};
