export default class NameValuePair {
  [key: string]: any;
  value!: string;
  name!: string;

  constructor() {
    // booleans:  need to be initialized to true or false for controlled checkboxes
    // strings for list items:  need to be initialized to empty string to clear listbox (input select)
  }
}