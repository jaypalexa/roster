export default class HoldingTankModel {
  [key: string]: any;
  holdingTankId!: string;
  organizationId!: string;
  holdingTankName!: string;

  constructor() {
    // booleans:  need to be initialized to true or false for controlled checkboxes
    // strings for list items:  need to be initialized to empty string to clear listbox (input select)
  }
};
