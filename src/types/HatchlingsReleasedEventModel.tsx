export default interface HatchlingsReleasedEventModel {
  hatchlingsReleasedEventId: string;
  organizationId: string;
  speciesCode: string;
  eventDate: Date;
  beachEventCount: number;
  offshoreEventCount: number;
};
