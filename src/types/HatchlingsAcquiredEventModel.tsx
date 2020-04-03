export default interface HatchlingsAcquiredEventModel {
  hatchlingsAcquiredEventId: string;
  organizationId: string;
  speciesCode: string;
  eventDate: Date;
  eventCount: number;
  acquiredFromCounty: string;
};
