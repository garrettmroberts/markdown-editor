import { useContext } from 'react';
import { DirectoryContext } from '../contexts/DirectoryContext';

export const useDirectoryContext = () => {
  const context = useContext(DirectoryContext);
  if (!context) {
    throw new Error(
      'useDirectoryContext must be used within a DirectoryProvider'
    );
  }
  return context;
};
