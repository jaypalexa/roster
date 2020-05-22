export default interface TaggingDataFormReportOptionsDto {
  [key: string]: any;
  seaTurtleId: string;
  populateFacilityField: boolean;
  printSidOnForm: boolean;
  additionalRemarksOrDataOnBackOfForm: boolean;
  useMorphometricsClosestTo: string;
};
