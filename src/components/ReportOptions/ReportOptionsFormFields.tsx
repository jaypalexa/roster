import MarineTurtleCaptiveFacilityQuarterlyReportOptions from 'components/ReportOptions/MarineTurtleCaptiveFacilityQuarterlyReportOptions';
import MarineTurtleHoldingFacilityQuarterlyReportOptions from 'components/ReportOptions/MarineTurtleHoldingFacilityQuarterlyReportOptions';
import TaggingDataFormOptions from 'components/ReportOptions/TaggingDataFormOptions';
import TurtleInjuryReportOptions from 'components/ReportOptions/TurtleInjuryReportOptions';
import ReportListItemModel from 'models/ReportListItemModel';
import React from 'react';
import HatchlingsAndWashbacksByCountyReportOptions from './HatchlingsAndWashbacksByCountyReportOptions';
import './ReportOptionsFormFields.sass';
import TurtleTagReportOptions from './TurtleTagReportOptions';

export interface ReportOptionsFormFieldsProps {
  currentReportListItem: ReportListItemModel;
  setShowSpinner: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReportOptionsFormFields: React.FC<ReportOptionsFormFieldsProps> = ({currentReportListItem, setShowSpinner}) => {
  var reportOptionsFormFields = <></>;
  switch (currentReportListItem.reportId) {
    /* FWC REPORTS (PDF) */
    case 'MarineTurtleCaptiveFacilityQuarterlyReportForHatchlings':
    case 'MarineTurtleCaptiveFacilityQuarterlyReportForWashbacks':
      reportOptionsFormFields = <MarineTurtleCaptiveFacilityQuarterlyReportOptions currentReportListItem={currentReportListItem} />;
      break;
    case 'MarineTurtleHoldingFacilityQuarterlyReport':
      reportOptionsFormFields = <MarineTurtleHoldingFacilityQuarterlyReportOptions currentReportListItem={currentReportListItem} />;
      break;
    case 'TaggingDataForm':
      reportOptionsFormFields = <TaggingDataFormOptions currentReportListItem={currentReportListItem} setShowSpinner={setShowSpinner} />
      break;

    /* OTHER REPORTS (HTML) */
    case 'HatchlingsAndWashbacksByCountyReport':
      reportOptionsFormFields = <HatchlingsAndWashbacksByCountyReportOptions currentReportListItem={currentReportListItem} />;
      break;
    case 'TurtleInjuryReport':
      reportOptionsFormFields = <TurtleInjuryReportOptions currentReportListItem={currentReportListItem} />;
      break;
    case 'TurtleTagReport':
      reportOptionsFormFields = <TurtleTagReportOptions currentReportListItem={currentReportListItem} />;
      break;
    default:
      reportOptionsFormFields = <></>;
      break;
  }
  return <div id='reportOptionsFormFields'>{reportOptionsFormFields}</div>
};

export default ReportOptionsFormFields;
