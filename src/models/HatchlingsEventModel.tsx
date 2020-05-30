export default interface HatchlingsEventModel {
  [key: string]: any;
  hatchlingsEventId: string;
  organizationId: string;
  eventType: string;
  species: string;
  eventDate: Date;
  eventCount: number | string; // kludge because input controls deal only with strings
  beachEventCount: number | string; // kludge because input controls deal only with strings
  offshoreEventCount: number | string; // kludge because input controls deal only with strings
  eventCounty: string;
};
