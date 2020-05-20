import MarineTurtleCaptiveFacilityQuarterlyReportOptions from 'components/ReportOptions/MarineTurtleCaptiveFacilityQuarterlyReportOptions';
import MarineTurtleHoldingFacilityQuarterlyReportOptions from 'components/ReportOptions/MarineTurtleHoldingFacilityQuarterlyReportOptions';
import TaggingDataFormOptions from 'components/ReportOptions/TaggingDataFormOptions';
import TurtleInjuryReportOptions from 'components/ReportOptions/TurtleInjuryReportOptions';
import ReportListItemModel from 'models/ReportListItemModel';
import React from 'react';
import './ReportOptions.sass';

interface ReportOptionsProps {
  currentReportListItem: ReportListItemModel;
  setShowSpinner: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReportOptions: React.FC<ReportOptionsProps> = ({currentReportListItem, setShowSpinner}) => {
  switch (currentReportListItem.reportId) {
    case 'TurtleInjuryReport':
      return <TurtleInjuryReportOptions />;
    case 'MarineTurtleHoldingFacilityQuarterlyReport':
      return <MarineTurtleHoldingFacilityQuarterlyReportOptions />;
    case 'MarineTurtleCaptiveFacilityQuarterlyReportForHatchlings':
    case 'MarineTurtleCaptiveFacilityQuarterlyReportForWashbacks':
      return <MarineTurtleCaptiveFacilityQuarterlyReportOptions />;
    case 'TaggingDataForm':
      return <TaggingDataFormOptions setShowSpinner={setShowSpinner} />
    default:
      return <></>;
  }
};

export default ReportOptions;
