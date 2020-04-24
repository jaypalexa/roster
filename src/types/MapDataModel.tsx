import MapPointModel from './MapPointModel';

export default interface MapDataModel {
  title?: string;
  center: MapPointModel;
  initialZoom?: number;
  markers?: Array<MapPointModel>
};
