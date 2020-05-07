export default interface HatchlingsReleasedEventModel {
  [key: string]: any;
  hatchlingsReleasedEventId: string;
  organizationId: string;
  speciesCode: string;
  eventDate: Date;
  beachEventCount: number;
  offshoreEventCount: number;
};
