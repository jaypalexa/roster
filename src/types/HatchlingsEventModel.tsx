export default interface HatchlingsEventModel {
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
