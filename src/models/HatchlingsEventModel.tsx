export default interface HatchlingsEventModel {
  [key: string]: any;
  hatchlingsEventId: string;
  organizationId: string;
  eventType: string;
  speciesCode: string;
  eventDate: Date;
  eventCount: number;
  beachEventCount: number;
  offshoreEventCount: number;
  eventCounty: string;
};
