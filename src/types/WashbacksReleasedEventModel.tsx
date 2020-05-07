export default interface WashbacksReleasedEventModel {
  [key: string]: any;
  washbacksReleasedEventId: string;
  organizationId: string;
  speciesCode: string;
  eventDate: Date;
  beachEventCount: number;
  offshoreEventCount: number;
};
