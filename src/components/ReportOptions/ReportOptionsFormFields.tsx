import MarineTurtleCaptiveFacilityQuarterlyReportOptions from 'components/ReportOptions/MarineTurtleCaptiveFacilityQuarterlyReportOptions';
import MarineTurtleHoldingFacilityQuarterlyReportOptions from 'components/ReportOptions/MarineTurtleHoldingFacilityQuarterlyReportOptions';
import TaggingDataFormOptions from 'components/ReportOptions/TaggingDataFormOptions';
import TurtleInjuryReportOptions from 'components/ReportOptions/TurtleInjuryReportOptions';
import ReportListItemModel from 'models/ReportListItemModel';
import React from 'react';
import HatchlingsAndWashbacksByCountyReportOptions from './HatchlingsAndWashbacksByCountyReportOptions';
import './ReportOptionsFormFields.sass';
import TurtleTagReportOptions from './TurtleTagReportOptions';

interface ReportOptionsFormFieldsProps {
  currentReportListItem: ReportListItemModel;
  setShowSpinner: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReportOptionsFormFields: React.FC<ReportOptionsFormFieldsProps> = ({currentReportListItem, setShowSpinner}) => {
  var reportOptionsFormFields = <></>;
  switch (currentReportListItem.reportId) {
    /* FWC REPORTS (PDF) */
    case 'MarineTurtleCaptiveFacilityQuarterlyReportForHatchlings':
    case 'MarineTurtleCaptiveFacilityQuarterlyReportForWashbacks':
      reportOptionsFormFields = <MarineTurtleCaptiveFacilityQuarterlyReportOptions />;
      break;
    case 'MarineTurtleHoldingFacilityQuarterlyReport':
      reportOptionsFormFields = <MarineTurtleHoldingFacilityQuarterlyReportOptions />;
      break;
    case 'TaggingDataForm':
      reportOptionsFormFields = <TaggingDataFormOptions setShowSpinner={setShowSpinner} />
      break;

    /* OTHER REPORTS (HTML) */
    case 'HatchlingsAndWashbacksByCountyReport':
      reportOptionsFormFields = <HatchlingsAndWashbacksByCountyReportOptions />;
      break;
    case 'TurtleInjuryReport':
      reportOptionsFormFields = <TurtleInjuryReportOptions />;
      break;
    case 'TurtleTagReport':
      reportOptionsFormFields = <TurtleTagReportOptions />;
      break;
    default:
      reportOptionsFormFields = <></>;
      break;
  }
  return <div id='reportOptionsFormFields'>{reportOptionsFormFields}</div>
};

export default ReportOptionsFormFields;
