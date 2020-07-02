export default class WashbacksEventModel {
  [key: string]: any;
  washbacksEventId!: string;
  organizationId!: string;
  eventType!: string;
  speciesCode!: string;
  eventDate?: string;
  eventCount!:  number | string; // kludge because input controls deal only with strings
  beachEventCount!:  number | string; // kludge because input controls deal only with strings
  offshoreEventCount!:  number | string; // kludge because input controls deal only with strings
  eventCounty?: string;
  under5cmClsl!: boolean;

  constructor() {
    // booleans:  need to be initialized to true or false for controlled checkboxes
    // strings for list items:  need to be initialized to empty string to clear listbox (input select)
    this.speciesCode = '';
    this.under5cmClsl = false;
  }
};
