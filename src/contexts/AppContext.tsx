import HoldingTankModel from 'models/HoldingTankModel';
import SeaTurtleModel from 'models/SeaTurtleModel';
import React, { createContext, useContext, useState } from 'react';

interface Props {
  children: React.ReactNode;
};

interface AppContextStore {
  seaTurtle?: SeaTurtleModel;
  holdingTank?: HoldingTankModel;
};

const initialAppContextStore = {} as AppContextStore;

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

