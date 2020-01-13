import React, { createContext, Dispatch, SetStateAction, useState } from 'react';

interface Props {
  children: React.ReactNode;
};

interface AppContextStore {
  organizationId: string;
  setOrganizationId: Dispatch<SetStateAction<string>>;
};

const initialAppContextStore: AppContextStore = {
  organizationId: '11111111-1111-1111-1111-111111111111',
  setOrganizationId: (): void => {
    throw new Error('setOrganizationId function must be overridden');
  }
};

const AppContext = createContext<AppContextStore>(initialAppContextStore);

const AppContextProvider = ({ children }: Props): JSX.Element => {
  const [organizationId, setOrganizationId] = useState<string>(initialAppContextStore.organizationId);

  return (
    <AppContext.Provider value={{ organizationId, setOrganizationId }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };

