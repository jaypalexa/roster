import MapPointModel from './MapPointModel';

export default class MapDataModel {
  [key: string]: any;
  title?: string;
  subtitle?: string;
  center!: MapPointModel;
  initialZoom?: number;
  markers?: Array<MapPointModel>

  constructor() {
    // booleans:  need to be initialized to true or false for controlled checkboxes
    // strings for list items:  need to be initialized to empty string to clear listbox (input select)
  }
};
