import HoldingTankModel from 'models/HoldingTankModel';
import SeaTurtleModel from 'models/SeaTurtleModel';
import React, { createContext, useContext, useState } from 'react';
import { Dictionary } from 'utils';

interface Props {
  children: React.ReactNode;
};

interface AppContextStore {
  seaTurtle?: SeaTurtleModel;
  holdingTank?: HoldingTankModel;
  reportOptions: Dictionary<any>;
  isUpdateAvailable?: boolean;
};

const initialAppContextStore = { reportOptions: {} } as AppContextStore;

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

