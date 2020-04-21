export default interface HoldingTankMeasurementModel {
  tankMeasurementId: string;
  tankId: string;
  dateMeasured: Date;
  temperature: number;
  salinity: number;
  ph: number;
  [key: string]: any;
};
