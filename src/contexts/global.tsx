import { betAbi } from '@/lib/abi';
import { ContractType, getContractAddressForEnv } from '@/lib/contracts';
import { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { readContract } from '@wagmi/core';
import { useAccount, useConfig } from 'wagmi';

// #region types
type Action =
  | {
      type: 'addBets';
      payload: { address: `0x${string}`; bets: Bet[] };
    }
  | {
      type: 'addEvents';
      payload: SportEvent[];
    }
  | { type: 'setTimestamp'; payload: number };

type State = {
  timestamp?: number;
  bets: { [address: `0x${string}`]: Bet[] };
  events: SportEvent[];
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
    case 'addBets': {
      return {
        ...state,
        bets: { ...state.bets, [action.payload.address]: action.payload.bets },
      };
    }
    case 'addEvents': {
      const track = new Set();
      const arr = [...state.events, ...action.payload];
      return {
        ...state,
        events: arr.filter(({ uid }) => (track.has(uid) ? false : track.add(uid))),
      };
    }
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
  const config = useConfig();
  const { address } = useAccount();

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
