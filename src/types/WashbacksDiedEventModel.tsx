export default interface WashbacksDiedEventModel {
  [key: string]: any;
  washbacksDiedEventId: string;
  organizationId: string;
  speciesCode: string;
  eventDate: Date;
  eventCount: number;
  under5cmClsl: string;
};
