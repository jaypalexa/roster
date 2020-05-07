export default interface ReportModel {
  [key: string]: any;
  data: string; // PDF content as a base64-encoded string
  url: string;  // object URL created from blob
};
