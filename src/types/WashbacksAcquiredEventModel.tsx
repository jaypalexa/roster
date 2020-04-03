export default interface WashbacksAcquiredEventModel {
  washbacksAcquiredEventId: string;
  organizationId: string;
  speciesCode: string;
  eventDate: Date;
  eventCount: number;
  acquiredFromCounty: string;
  under5cmClsl: string;
};
