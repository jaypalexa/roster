export default interface OrganizationModel {
  [key: string]: any;
  organizationId: string;
  organizationName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  fax: string;
  emailAddress: string;
  permitNumber: string;
  contactName: string;
  preferredUnitsType: string;
  hatchlingsBalanceAsOfDate: Date;
  ccHatchlingsStartingBalance: number | string; // kludge because input controls deal only with strings
  cmHatchlingsStartingBalance: number | string; // kludge because input controls deal only with strings
  dcHatchlingsStartingBalance: number | string; // kludge because input controls deal only with strings
  otherHatchlingsStartingBalance: number | string; // kludge because input controls deal only with strings
  unknownHatchlingsStartingBalance: number | string; // kludge because input controls deal only with strings
  washbacksBalanceAsOfDate: Date;
  ccWashbacksStartingBalance: number | string; // kludge because input controls deal only with strings
  cmWashbacksStartingBalance: number | string; // kludge because input controls deal only with strings
  dcWashbacksStartingBalance: number | string; // kludge because input controls deal only with strings
  otherWashbacksStartingBalance: number | string; // kludge because input controls deal only with strings
  unknownWashbacksStartingBalance: number | string; // kludge because input controls deal only with strings
};
