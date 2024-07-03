import { createContext, ReactNode, useContext, useReducer } from 'react';

// #region types
type Action = { type: 'setCurrency', payload: 'USD' | 'EUR' | 'RUB' } | { type: 'resetCurrency' };
type State = {
  currency: 'USD' | 'EUR' | 'RUB'
};
// #endregion

const initialState = () => ({
  currency: 'USD'
} as State);

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'setCurrency': {
      return {
        ...state,
        currency: action.payload
      };
    }
    default: {
      throw new Error('Unhandled action type: ' + action.type);
    }
  }
}

// #region context boilerplate
const GlobalContext = createContext<{ state: State, dispatch: (action: Action) => void } | undefined>(undefined);

function GlobalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState());

  return <GlobalContext.Provider value={{ state, dispatch }}>
    {children}
  </GlobalContext.Provider>
}

function useGlobalContext() {
  const context = useContext(GlobalContext);

  if (context === undefined) {
    throw new Error('useGlobal usage must be wrapped with GlobalContext provider.');
  }

  return context;
}
// #endregion

export {
  GlobalProvider,
  useGlobalContext
};
