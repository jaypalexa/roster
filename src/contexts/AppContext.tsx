import React, { createContext, useContext, useState } from 'react';
import SeaTurtleModel from 'types/SeaTurtleModel';

interface Props {
  children: React.ReactNode;
};

interface AppContextStore {
  redirectPathOnAuthentication?: string;
  organizationId?: string;
  seaTurtle?: SeaTurtleModel
};

const initialAppContextStore: AppContextStore = {};

const AppContext = createContext<[AppContextStore, (appContextStore: AppContextStore) => void]>([initialAppContextStore, () => {}]);

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

