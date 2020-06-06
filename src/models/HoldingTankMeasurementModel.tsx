export default class HoldingTankMeasurementModel {
  [key: string]: any;
  holdingTankMeasurementId!: string;
  holdingTankId!: string;
  dateMeasured!: Date;
  temperature!: number | string; // kludge because input controls deal only with strings
  salinity!: number | string; // kludge because input controls deal only with strings
  ph!: number | string; // kludge because input controls deal only with strings
};
