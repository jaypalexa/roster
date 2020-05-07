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
  ccHatchlingsStartingBalance: number;
  cmHatchlingsStartingBalance: number;
  dcHatchlingsStartingBalance: number;
  otherHatchlingsStartingBalance: number;
  unknownHatchlingsStartingBalance: number;
  washbacksBalanceAsOfDate: Date;
  ccWashbacksStartingBalance: number;
  cmWashbacksStartingBalance: number;
  dcWashbacksStartingBalance: number;
  otherWashbacksStartingBalance: number;
  unknownWashbacksStartingBalance: number;
};
