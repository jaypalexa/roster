export default class MapPointModel {
  [key: string]: any;
  latitude!: number;
  longitude!: number;
  description?: string;

  constructor() {
    // booleans:  need to be initialized to true or false for controlled checkboxes
    // strings for list items:  need to be initialized to empty string to clear listbox (input select)
  }
};
