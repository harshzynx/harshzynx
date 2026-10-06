import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../lib/api.ts';
import type { PublicDataResponse } from '../lib/api.ts';

interface DataContextType {
  data: PublicDataResponse | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PublicDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    try {
      const res = await api.getPublicData();
      setData(res);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching public portfolio data:', err);
      setError(err?.message || 'Failed to load portfolio content.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
    // Record initial page view
    api.recordAnalytics('page_view', window.location.pathname || '/');
  }, [refreshData]);

  return (
    <DataContext.Provider value={{ data, loading, error, refreshData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
