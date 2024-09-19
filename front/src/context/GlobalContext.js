import React, { createContext, useState } from 'react';

// Créer le contexte
export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [selectedCompetitorlbl, setSelectedCompetitorlbl] = useState('');

  return (
    <GlobalContext.Provider value={{ selectedCompetitorlbl, setSelectedCompetitorlbl }}>
      {children}
    </GlobalContext.Provider>
  );
};
