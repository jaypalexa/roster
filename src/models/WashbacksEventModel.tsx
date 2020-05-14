export default interface WashbacksEventModel {
  [key: string]: any;
  washbacksEventId: string;
  organizationId: string;
  eventType: string;
  speciesCode: string;
  eventDate: Date;
  eventCount: number;
  beachEventCount: number;
  offshoreEventCount: number;
  eventCounty: string;
  under5cmClsl: boolean;
};
