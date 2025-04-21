import React, {
  Dispatch,
  createContext,
  ReactNode,
  useEffect,
  useReducer
} from 'react';

interface DirectoryState {
  notebooks: string[];
  folders: string[];
  files: string[];
  activeNotebook: string;
  activeFolder: string;
  activeFile: string;
}

type DirectoryAction =
  | { type: 'SET_NOTEBOOKS'; payload: string[] }
  | { type: 'SET_FOLDERS'; payload: string[] }
  | { type: 'SET_FILES'; payload: string[] }
  | { type: 'SET_ACTIVE_NOTEBOOK'; payload: string }
  | { type: 'SET_ACTIVE_FOLDER'; payload: string }
  | { type: 'SET_ACTIVE_FILE'; payload: string }
  | { type: 'CREATE_NOTEBOOK'; payload: string }
  | { type: 'CREATE_FOLDER'; payload: string }
  | { type: 'CREATE_FILE'; payload: string }
  | { type: 'REMOVE_NOTEBOOK'; payload: string }
  | { type: 'REMOVE_FOLDER'; payload: string }
  | { type: 'REMOVE_FILE'; payload: string }
  | { type: 'UPDATE_NOTEBOOK'; payload: { oldName: string; newName: string } }
  | { type: 'UPDATE_FOLDER'; payload: { oldName: string; newName: string } }
  | { type: 'UPDATE_FILE'; payload: { oldName: string; newName: string } };

interface DirectoryContextType extends DirectoryState {
  dispatch: Dispatch<DirectoryAction>;
  setActiveNotebook: (notebook: string) => void;
  setActiveFolder: (folder: string) => void;
  setActiveFile: (file: string) => void;
  createNotebook: (notebook: string) => void;
  createFolder: (folder: string) => void;
  createFile: (folder: string) => void;
  removeNotebook: (notebook: string) => void;
  removeFolder: (folder: string) => void;
  removeFile: (file: string) => void;
  updateNotebook: (oldName: string, newName: void) => void;
  updateFolder: (oldName: string, newName: string) => void;
  updateFile: (oldName: string, newName: string) => void;
}

const initialState: DirectoryState = {
  notebooks: [],
  folders: [],
  files: [],
  activeNotebook: '',
  activeFolder: '',
  activeFile: ''
};

const directoryReducer = (
  state: DirectoryState,
  action: DirectoryAction
): DirectoryState => {
  switch (action.type) {
    case 'SET_NOTEBOOKS':
      return { ...state, notebooks: action.payload };
    case 'SET_FOLDERS':
      return { ...state, folders: action.payload };
    case 'SET_FILES':
      return { ...state, files: action.payload };
    case 'SET_ACTIVE_NOTEBOOK':
      return { ...state, activeNotebook: action.payload };
    case 'SET_ACTIVE_FOLDER':
      return { ...state, activeFolder: action.payload };
    case 'SET_ACTIVE_FILE':
      return { ...state, activeFile: action.payload };
    case 'CREATE_NOTEBOOK':
      return {
        ...state,
        notebooks: [...state.notebooks, action.payload]
      };
    case 'CREATE_FOLDER':
      return {
        ...state,
        folders: [...state.folders, action.payload]
      };
    case 'CREATE_FILE':
      return {
        ...state,
        files: [...state.files, action.payload]
      };
    case 'REMOVE_NOTEBOOK':
      return {
        ...state,
        notebooks: state.notebooks.filter(
          (notebook) => notebook !== action.payload
        )
      };
    case 'REMOVE_FOLDER':
      return {
        ...state,
        folders: state.folders.filter((folder) => folder !== action.payload)
      };
    case 'REMOVE_FILE':
      return {
        ...state,
        files: state.files.filter((file) => file !== action.payload)
      };
    case 'UPDATE_NOTEBOOK':
      return {
        ...state,
        notebooks: state.notebooks.map((notebook) =>
          notebook === action.payload.oldName
            ? action.payload.newName
            : notebook
        ) as string[]
      };
    case 'UPDATE_FOLDER':
      return {
        ...state,
        folders: state.folders.map((folder) =>
          folder === action.payload.oldName ? action.payload.newName : folder
        )
      };
    case 'UPDATE_FILE':
      return {
        ...state,
        files: state.files.map((file) =>
          file === action.payload.oldName ? action.payload.newName : file
        )
      };
    default:
      return state;
  }
};

export const DirectoryContext = createContext<DirectoryContextType | undefined>(
  undefined
);

export const DirectoryProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [state, dispatch] = useReducer(directoryReducer, initialState);

  // // Fetch initial data
  // useEffect(() => {
  //   try {
  //     const notebooks = window.api.listFiles('src/data');

  //     if (notebooks.length > 0) {
  //       dispatch({ type: 'SET_NOTEBOOKS', payload: notebooks });
  //       dispatch({ type: 'SET_ACTIVE_NOTEBOOK', payload: notebooks[0] });

  //       const folders = window.api.listFiles(`src/data/${notebooks[0]}`);
  //       if (folders.length > 0) {
  //         dispatch({ type: 'SET_FOLDERS', payload: folders });
  //         dispatch({ type: 'SET_ACTIVE_FOLDER', payload: folders[0] });

  //         const files = window.api.listFiles(
  //           `src/data/${notebooks[0]}/${folders[0]}`
  //         );
  //         if (files.length > 0) {
  //           dispatch({ type: 'SET_FILES', payload: files });
  //           dispatch({ type: 'SET_ACTIVE_FILE', payload: files[0] });
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error loading directory structure: ', error);
  //   }
  // }, []);

  const value: DirectoryContextType = {
    ...state,
    dispatch,
    setActiveNotebook: function (notebook: string): void {
      throw new Error('Function not implemented.');
    },
    setActiveFolder: function (folder: string): void {
      throw new Error('Function not implemented.');
    },
    setActiveFile: function (file: string): void {
      throw new Error('Function not implemented.');
    },
    createNotebook: function (notebook: string): void {
      throw new Error('Function not implemented.');
    },
    createFolder: function (folder: string): void {
      throw new Error('Function not implemented.');
    },
    createFile: function (file: string): void {
      throw new Error('Function not implemented.');
    },
    removeNotebook: function (notebook: string): void {
      throw new Error('Function not implemented.');
    },
    removeFolder: function (folder: string): void {
      throw new Error('Function not implemented.');
    },
    removeFile: function (file: string): void {
      throw new Error('Function not implemented.');
    },
    updateNotebook: function (oldName: string, newName: void): void {
      throw new Error('Function not implemented.');
    },
    updateFolder: function (oldName: string, newName: string): void {
      throw new Error('Function not implemented.');
    },
    updateFile: function (oldName: string, newName: string): void {
      throw new Error('Function not implemented.');
    }
  };

  return (
    <DirectoryContext.Provider value={value}>
      {children}
    </DirectoryContext.Provider>
  );
};
