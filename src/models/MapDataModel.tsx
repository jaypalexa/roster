import MapPointModel from './MapPointModel';

export default class MapDataModel {
  [key: string]: any;
  title?: string;
  subtitle?: string;
  center!: MapPointModel;
  initialZoom?: number;
  markers?: Array<MapPointModel>
};
