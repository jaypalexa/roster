export default interface HatchlingsAcquiredEventModel {
  [key: string]: any;
  hatchlingsAcquiredEventId: string;
  organizationId: string;
  speciesCode: string;
  eventDate: Date;
  eventCount: number;
  acquiredFromCounty: string;
};
