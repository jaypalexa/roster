export default class OrganizationModel {
  [key: string]: any;
  organizationId!: string;
  organizationName!: string;
  address1?: string;
  address2?: string;
  city?: string;
  state!: string;
  zipCode?: string;
  phone?: string;
  fax?: string;
  emailAddress?: string;
  permitNumber?: string;
  contactName?: string;
  preferredUnitsType!: string;
  hatchlingsBalanceAsOfDate?: string;
  ccHatchlingsStartingBalance!: number | string; // kludge because input controls deal only with strings
  cmHatchlingsStartingBalance!: number | string; // kludge because input controls deal only with strings
  dcHatchlingsStartingBalance!: number | string; // kludge because input controls deal only with strings
  otherHatchlingsStartingBalance!: number | string; // kludge because input controls deal only with strings
  unknownHatchlingsStartingBalance!: number | string; // kludge because input controls deal only with strings
  washbacksBalanceAsOfDate!: string;
  ccWashbacksStartingBalance!: number | string; // kludge because input controls deal only with strings
  cmWashbacksStartingBalance!: number | string; // kludge because input controls deal only with strings
  dcWashbacksStartingBalance!: number | string; // kludge because input controls deal only with strings
  otherWashbacksStartingBalance!: number | string; // kludge because input controls deal only with strings
  unknownWashbacksStartingBalance!: number | string; // kludge because input controls deal only with strings

  constructor() {
    // booleans:  need to be initialized to true or false for controlled checkboxes
    // strings for list items:  need to be initialized to empty string to clear listbox (input select)
    this.state = 'Florida';
    this.preferredUnitsType = 'M';
  }
};
