export default class LogEntryModel {
  [key: string]: any;
  logEntryId!: string;      // FROM SERVER:  NOW AS UTC = yyyy-MM-dd-HH-mm-ss-fff
  organizationId!: string;  // FROM CLIENT
  userName!: string;        // FROM CLIENT
  entryDateTime?: string;   // FROM SERVER:  NOW AS UTC == yyyy-MM-dd HH:mm:ssZ
  message!: string;         // FROM CLIENT
  timestamp?: number;       // FROM SERVER:  NOWUNIX TIMESTAMP IN SECONDS
};
