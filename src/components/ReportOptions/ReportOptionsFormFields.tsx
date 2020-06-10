import MarineTurtleCaptiveFacilityQuarterlyReportOptions from 'components/ReportOptions/MarineTurtleCaptiveFacilityQuarterlyReportOptions';
import MarineTurtleHoldingFacilityQuarterlyReportOptions from 'components/ReportOptions/MarineTurtleHoldingFacilityQuarterlyReportOptions';
import TaggingDataFormOptions from 'components/ReportOptions/TaggingDataFormOptions';
import TurtleInjuryReportOptions from 'components/ReportOptions/TurtleInjuryReportOptions';
import ReportDefinitionModel from 'models/ReportDefinitionModel';
import React from 'react';
import HatchlingsAndWashbacksByCountyReportOptions from './HatchlingsAndWashbacksByCountyReportOptions';
import TurtleTagReportOptions from './TurtleTagReportOptions';

export interface ReportOptionsFormFieldsProps {
  reportDefinition: ReportDefinitionModel;
  setShowSpinner: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReportOptionsFormFields: React.FC<ReportOptionsFormFieldsProps> = ({reportDefinition, setShowSpinner}) => {
  var reportOptionsFormFields = <></>;
  switch (reportDefinition.reportId) {
    /* FWC REPORTS (PDF) */
    case 'MarineTurtleCaptiveFacilityQuarterlyReportForHatchlings':
    case 'MarineTurtleCaptiveFacilityQuarterlyReportForWashbacks':
      reportOptionsFormFields = <MarineTurtleCaptiveFacilityQuarterlyReportOptions reportDefinition={reportDefinition} />;
      break;
    case 'MarineTurtleHoldingFacilityQuarterlyReport':
      reportOptionsFormFields = <MarineTurtleHoldingFacilityQuarterlyReportOptions reportDefinition={reportDefinition} />;
      break;
    case 'TaggingDataForm':
      reportOptionsFormFields = <TaggingDataFormOptions reportDefinition={reportDefinition} setShowSpinner={setShowSpinner} />
      break;

    /* OTHER REPORTS (HTML) */
    case 'HatchlingsAndWashbacksByCountyReport':
      reportOptionsFormFields = <HatchlingsAndWashbacksByCountyReportOptions reportDefinition={reportDefinition} />;
      break;
    case 'TurtleInjuryReport':
      reportOptionsFormFields = <TurtleInjuryReportOptions reportDefinition={reportDefinition} />;
      break;
    case 'TurtleTagReport':
      reportOptionsFormFields = <TurtleTagReportOptions reportDefinition={reportDefinition} />;
      break;
    default:
      reportOptionsFormFields = <></>;
      break;
  }
  return <div id='reportOptionsFormFields'>{reportOptionsFormFields}</div>
};

export default ReportOptionsFormFields;
