import { createContext, ReactNode, useContext, useEffect, useReducer, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { betAbi } from '../lib/abi';
import { getContractAddressForEnv } from '../lib/contracts';

// #region types
type Action =
  | {
      type: 'setBets';
      payload: { address: `0x${string}`; bets: BetWithEvent[] };
    }
  | { type: 'setTimestamp'; payload: number | undefined };

type State = {
  timestamp: number | undefined;
  bets: { [address: `0x${string}`]: BetWithEvent[] };
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
    case 'setBets': {
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
  { state: State; dispatch: (action: Action) => void; reloadBets: () => void } | undefined
>(undefined);

function GlobalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState());
  const { address } = useAccount();
  const [bets, setBets] = useState<Bet[]>([]);
  const [eventUids, setEventUids] = useState<string[]>([]);

  const contract = {
    abi: betAbi,
    address: getContractAddressForEnv(process.env.NODE_ENV),
  };

  const { data: betData, refetch: reloadBets } = useReadContract({
    ...contract,
    functionName: 'getBetsByUser',
    args: [address],
    query: { staleTime: 1 * 60 * 1000 },
  });

  const { data: eventData, refetch: refetchEvents } = useReadContract({
    ...contract,
    functionName: 'getEvents',
    args: [eventUids],
    query: { staleTime: 5 * 60 * 1000 },
  });

  useEffect(() => {
    if (Array.isArray(betData)) {
      if (betData.length) {
        setBets(betData);
        setEventUids([...new Set(betData.map(x => x.eventUID))]);
        refetchEvents();
      } else {
        setBets([]);
      }
    }
  }, [betData]);

  useEffect(() => {
    if (Array.isArray(eventData) && eventData.length && address) {
      const betsWithEvents = bets.map(bet => ({
        ...bet,
        event: eventData.find(event => event.uid == bet.eventUID),
      }));
      console.log(betsWithEvents);
      dispatch({
        type: 'setBets',
        payload: { address, bets: betsWithEvents },
      });
    }
  }, [eventData]);

  return (
    <GlobalContext.Provider value={{ state, dispatch, reloadBets }}>
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
