import { useContext } from 'react';
import { UIContext } from '../contexts/UIContext';

export const useUIContext = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIContext must be used within a UIContextProvider');
  }
  return context;
};
