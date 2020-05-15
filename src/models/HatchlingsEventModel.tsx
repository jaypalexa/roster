export default interface HatchlingsEventModel {
  [key: string]: any;
  hatchlingsEventId: string;
  organizationId: string;
  eventType: string;
  species: string;
  eventDate: Date;
  eventCount: number;
  beachEventCount: number;
  offshoreEventCount: number;
  eventCounty: string;
};
