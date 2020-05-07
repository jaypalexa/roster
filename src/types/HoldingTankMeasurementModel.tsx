export default interface HoldingTankMeasurementModel {
  [key: string]: any;
  holdingTankMeasurementId: string;
  holdingTankId: string;
  dateMeasured: Date;
  temperature: number;
  salinity: number;
  ph: number;
};
