export default class HoldingTankMeasurementModel {
  [key: string]: any;
  holdingTankMeasurementId!: string;
  holdingTankId!: string;
  dateMeasured!: Date;
  temperature!: number | string; // kludge because input controls deal only with strings
  salinity!: number | string; // kludge because input controls deal only with strings
  ph!: number | string; // kludge because input controls deal only with strings

  constructor() {
    // booleans:  need to be initialized to true or false for controlled checkboxes
    // strings for list items:  need to be initialized to empty string to clear listbox (input select)
  }
};
