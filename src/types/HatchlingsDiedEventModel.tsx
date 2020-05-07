export default interface HatchlingsDiedEventModel {
  [key: string]: any;
  hatchlingsDiedEventId: string;
  organizationId: string;
  speciesCode: string;
  eventDate: Date;
  eventCount: number;
};
