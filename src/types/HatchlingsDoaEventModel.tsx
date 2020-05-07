export default interface HatchlingsDoaEventModel {
  [key: string]: any;
  hatchlingsDoaEventId: string;
  organizationId: string;
  speciesCode: string;
  eventDate: Date;
  eventCount: number;
  doaFromCounty: string;
};
