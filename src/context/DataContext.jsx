import React, { createContext, useContext } from 'react';
import useTournamentData from '@/hooks/useTournamentData';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const data = useTournamentData();
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};