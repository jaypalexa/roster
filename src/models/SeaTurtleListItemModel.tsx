export default interface SeaTurtleListItemModel {
  [key: string]: any;
  seaTurtleId: string;
  organizationId: string;
  seaTurtleName: string;
  sidNumber: string;
  species: string;
  dateAcquired: Date;
  acquiredCounty: string;
  turtleSize: string;
  status: string;
  dateRelinquished: Date;
};
