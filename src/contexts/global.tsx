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
  | { type: 'setTimestamp'; payload: number };
type State = {
  timestamp?: number;
  bets: { [address: `0x${string}`]: Bet[] };
};
// #endregion

const initialState = () =>
  ({
    timestamp: undefined,
    bets: {},
  }) as State;

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'addBets': {
      return {
        ...state,
        bets: { ...state.bets, [action.payload.address]: action.payload.bets },
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
  { state: State; dispatch: (action: Action) => void; loadBets: () => void } | undefined
>(undefined);

function GlobalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState());
  const config = useConfig();
  const { address } = useAccount();

  useEffect(() => {
    const dateTimestamp = new Date('2024-07-02').getTime() / 1000;
    const startOfDay = Math.floor(dateTimestamp - (dateTimestamp % 86400));
    dispatch({
      type: 'setTimestamp',
      payload: startOfDay,
    });
    loadBets();
  }, []);
  async function loadBets() {
    if (!address || !state.timestamp) {
      return;
    }
    const bets = (await readContract(config, {
      abi: betAbi,
      address: getContractAddressForEnv(ContractType.BET_SHOWCASE, process.env.NODE_ENV),
      functionName: 'getBetsByDateAndUser',
      args: [state.timestamp, address],
    } as any)) as Bet[];

    dispatch({
      type: 'addBets',
      payload: { address, bets },
    });
  }

  return (
    <GlobalContext.Provider value={{ state, dispatch, loadBets }}>
      {children}
    </GlobalContext.Provider>
  );
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
