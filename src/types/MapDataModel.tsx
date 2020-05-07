import MapPointModel from './MapPointModel';

export default interface MapDataModel {
  [key: string]: any;
  title?: string;
  center: MapPointModel;
  initialZoom?: number;
  markers?: Array<MapPointModel>
};
