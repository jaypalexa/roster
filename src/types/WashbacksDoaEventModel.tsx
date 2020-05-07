export default interface WashbacksDoaEventModel {
  [key: string]: any;
  washbacksDoaEventId: string;
  organizationId: string;
  speciesCode: string;
  eventDate: Date;
  eventCount: number;
  doaFromCounty: string;
  under5cmClsl: string;
};
