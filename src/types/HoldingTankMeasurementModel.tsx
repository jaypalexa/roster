export default interface HoldingTankMeasurementModel {
  [key: string]: any;
  tankMeasurementId: string;
  tankId: string;
  dateMeasured: Date;
  temperature: number;
  salinity: number;
  ph: number;
};
