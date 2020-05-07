export default interface WashbacksAcquiredEventModel {
  [key: string]: any;
  washbacksAcquiredEventId: string;
  organizationId: string;
  speciesCode: string;
  eventDate: Date;
  eventCount: number;
  acquiredFromCounty: string;
  under5cmClsl: boolean;
};
