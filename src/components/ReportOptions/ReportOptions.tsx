import MarineTurtleCaptiveFacilityQuarterlyReportOptions from 'components/ReportOptions/MarineTurtleCaptiveFacilityQuarterlyReportOptions';
import MarineTurtleHoldingFacilityQuarterlyReportOptions from 'components/ReportOptions/MarineTurtleHoldingFacilityQuarterlyReportOptions';
import TaggingDataFormOptions from 'components/ReportOptions/TaggingDataFormOptions';
import TurtleInjuryReportOptions from 'components/ReportOptions/TurtleInjuryReportOptions';
import ReportListItemModel from 'models/ReportListItemModel';
import React from 'react';
import HatchlingsAndWashbacksByCountyReportOptions from './HatchlingsAndWashbacksByCountyReportOptions';
import './ReportOptions.sass';
import TurtleTagReportOptions from './TurtleTagReportOptions';

interface ReportOptionsProps {
  currentReportListItem: ReportListItemModel;
  setShowSpinner: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReportOptions: React.FC<ReportOptionsProps> = ({currentReportListItem, setShowSpinner}) => {
  switch (currentReportListItem.reportId) {
    /* FWC REPORTS (PDF) */
    case 'MarineTurtleCaptiveFacilityQuarterlyReportForHatchlings':
    case 'MarineTurtleCaptiveFacilityQuarterlyReportForWashbacks':
      return <MarineTurtleCaptiveFacilityQuarterlyReportOptions />;
    case 'MarineTurtleHoldingFacilityQuarterlyReport':
      return <MarineTurtleHoldingFacilityQuarterlyReportOptions />;
    case 'TaggingDataForm':
      return <TaggingDataFormOptions setShowSpinner={setShowSpinner} />

    /* OTHER REPORTS (HTML) */
    case 'HatchlingsAndWashbacksByCountyReport':
      return <HatchlingsAndWashbacksByCountyReportOptions />;
    case 'TurtleInjuryReport':
      return <TurtleInjuryReportOptions />;
    case 'TurtleTagReport':
      return <TurtleTagReportOptions />;
    default:
      return <></>;
  }
};

export default ReportOptions;
