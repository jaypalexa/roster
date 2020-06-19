import TaggingDataFormReportOptionsDto from 'dtos/ReportOptions/TaggingDataFormReportOptionsDto';
import TurtleTagReportOptionsDto from 'dtos/ReportOptions/TurtleTagReportOptionsDto';
import HoldingTankModel from 'models/HoldingTankModel';
import SeaTurtleModel from 'models/SeaTurtleModel';
import React, { createContext, useContext, useState } from 'react';
import { Dictionary, getDefaultDateRange, ReportQuarter } from 'utils';

interface Props {
  children: React.ReactNode;
};

interface AppContextStore {
  seaTurtle?: SeaTurtleModel;
  holdingTank?: HoldingTankModel;
  reportOptions: Dictionary<any>;
  isCheckedShowRelinquishedTurtles: boolean;
};

const previousQuarterDateRange = getDefaultDateRange(ReportQuarter.Previous);
const defaultReportOptions = {
    
  HatchlingsAndWashbacksByCountyReport: previousQuarterDateRange,

  MarineTurtleCaptiveFacilityQuarterlyReportForHatchlings: {
    ...previousQuarterDateRange,
    comments: '',
    includeDoaCounts: false,
  },
  MarineTurtleCaptiveFacilityQuarterlyReportForWashbacks: {
    ...previousQuarterDateRange,
    comments: '',
    includeDoaCounts: false,
  },
  MarineTurtleHoldingFacilityQuarterlyReport: {
    ...previousQuarterDateRange,
    includeAnomalies: false,
    includeAcquiredFrom: false,
    includeTurtleName: false,
    groupTankDataBy: 'tank',
  },
  
  TaggingDataForm: {
    seaTurtleId: '',
    populateFacilityField: false,
    printSidOnForm: false,
    additionalRemarksOrDataOnBackOfForm: false,
    useMorphometricsClosestTo: 'dateAcquired',
  } as TaggingDataFormReportOptionsDto,

  TurtleInjuryReport: previousQuarterDateRange,

  TurtleTagReport: {
    ...getDefaultDateRange(ReportQuarter.Previous),
    filterDateType: 'dateAcquired',
    includeNonRelinquishedTurtles: true,
    includeStrandingIdNumber: false,
    isPit: true,
    isLff: true,
    isRff: true,
    isLrf: true,
    isRrf: true,
  } as TurtleTagReportOptionsDto,
}
const initialAppContextStore = { reportOptions: defaultReportOptions, isCheckedShowRelinquishedTurtles: false } as AppContextStore;

const AppContext = createContext<[AppContextStore, (appContextStore: AppContextStore) => void]>([initialAppContextStore, () => { }]);

const AppContextProvider = ({ children }: Props): JSX.Element => {
  const [appContext, setAppContext] = useState(initialAppContextStore);
  const defaultAppContext: [AppContextStore, typeof setAppContext] = [appContext, setAppContext];

  return (
    <AppContext.Provider value={defaultAppContext}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { AppContext, AppContextProvider, useAppContext };

