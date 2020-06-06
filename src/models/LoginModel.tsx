export default class LoginModel {
  [key: string]: any;
  userName!: string;
  password!: string;

  constructor() {
    // booleans:  need to be initialized to true or false for controlled checkboxes
    // strings for list items:  need to be initialized to empty string to clear listbox (input select)
  }
};
