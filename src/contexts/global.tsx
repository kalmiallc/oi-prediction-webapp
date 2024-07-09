import { betAbi } from '@/lib/abi';
import { ContractType, getContractAddressForEnv } from '@/lib/contracts';
import { createContext, ReactNode, useContext, useReducer } from 'react';
import { readContract } from '@wagmi/core';
import { useAccount, useConfig } from 'wagmi';

// #region types
type Action = { type: 'addBets'; payload: { address: `0x${string}`; bets: Bet[] } };
type State = {
  bets: { [address: `0x${string}`]: Bet[] };
};
// #endregion

const initialState = () =>
  ({
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
    default: {
      throw new Error('Unhandled action type: ' + action.type);
    }
  }
}

const GlobalContext = createContext<
  | { state: State; dispatch: (action: Action) => void; loadBets: (timestamp: number) => void }
  | undefined
>(undefined);

function GlobalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState());
  const config = useConfig();
  const { address } = useAccount();

  async function loadBets(timestamp: number) {
    if (!address) {
      return;
    }
    const bets = (await readContract(config, {
      abi: betAbi,
      address: getContractAddressForEnv(ContractType.BET_SHOWCASE, process.env.NODE_ENV),
      functionName: 'getBetsByDateAndUser',
      args: [timestamp, address],
    } as any)) as Bet[];

    console.log({ bets });
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
