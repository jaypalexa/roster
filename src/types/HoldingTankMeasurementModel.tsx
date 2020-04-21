export default interface HoldingTankMeasurementModel {
  tankMeasurementId: string;
  tankId: string;
  dateMeasured: Date;
  temperature: number;
  salinity: number;
  ph: number;
  //[key: string]: string | Date | number; // indexable; not a new property
  [key: string]: any;
};
