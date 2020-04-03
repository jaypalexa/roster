export default interface WashbacksReleasedEventModel {
  washbacksReleasedEventId: string;
  organizationId: string;
  speciesCode: string;
  eventDate: Date;
  beachEventCount: number;
  offshoreEventCount: number;
};
