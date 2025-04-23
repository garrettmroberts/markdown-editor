import React, { Dispatch, createContext, ReactNode, useReducer } from 'react';

export enum ModalTypes {
  CREATE_NOTEBOOK = 'create-notebook',
  CREATE_FOLDER = 'create-folder',
  CREATE_FILE = 'create-file',
  RENAME = 'rename',
  DELETE = 'delete',
  SETTINGS = 'settings',
  NONE = 'none'
}

type ModalData = {
  type: ModalTypes;
  data?: {
    notebook?: string;
    folder?: string;
  }
}

interface UIState {
  modal: ModalData;
}

type UIAction = { type: 'SET_MODAL'; payload: ModalData };

interface UIContextType extends UIState {
  dispatch: Dispatch<UIAction>;
  setModal: (modal: ModalData) => void;
}

const initialState: UIState = {
  modal: {
    type: ModalTypes.NONE,
    data: undefined
  }
};

const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case 'SET_MODAL':
      return {
        ...state,
        modal: action.payload
      };
    default:
      return state;
  }
};

export const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const value: UIContextType = {
    ...state,
    dispatch,
    setModal: (modal: ModalData) => {
      dispatch({ type: 'SET_MODAL', payload: modal });
    }
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
