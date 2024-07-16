import { createContext, ReactNode, useContext, useReducer } from 'react';

// #region types
type Action = { type: 'setTimestamp'; payload: number | undefined };

type State = {
  timestamp: number | undefined;
};
// #endregion

const initialState = () =>
  ({
    timestamp: undefined,
    bets: {},
    events: [],
  }) as State;

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'setTimestamp': {
      return {
        ...state,
        timestamp: action.payload,
      };
    }
    default: {
      throw new Error(('Unhandled action type: ' + action) as any);
    }
  }
}

const GlobalContext = createContext<
  { state: State; dispatch: (action: Action) => void } | undefined
>(undefined);

function GlobalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState());
  return <GlobalContext.Provider value={{ state, dispatch }}>{children}</GlobalContext.Provider>;
}

function useGlobalContext() {
  const context = useContext(GlobalContext);

  if (context === undefined) {
    throw new Error('useGlobal usage must be wrapped with GlobalContext provider.');
  }

  return context;
}
// #endregion

export { GlobalProvider, useGlobalContext };
