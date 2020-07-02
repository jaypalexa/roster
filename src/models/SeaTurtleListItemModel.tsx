export default class SeaTurtleListItemModel {
  [key: string]: any;
  seaTurtleId!: string;
  organizationId!: string;
  seaTurtleName!: string;
  sidNumber!: string;
  species!: string;
  dateAcquired!: string;
  acquiredCounty!: string;
  turtleSize!: string;
  status!: string;
  dateRelinquished!: string;

  constructor() {
    // booleans:  need to be initialized to true or false for controlled checkboxes
    // strings for list items:  need to be initialized to empty string to clear listbox (input select)
    this.species = '';
    this.acquiredCounty = '';
    this.turtleSize = '';
    this.status = '';
  }
};
