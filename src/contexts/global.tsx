import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { useAccount, useConfig, useReadContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { betAbi } from '../lib/abi';
import { getContractAddressForEnv } from '../lib/contracts';
import mitt, { Emitter } from 'mitt';
import { toast } from 'sonner';

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
  | {
      state: State;
      eventEmitter: Emitter<EmitEvent>;
      dispatch: (action: Action) => void;
      reloadBets: () => void;
      waitTx: (hash: `0x${string}`, type: 'placedBet' | 'claimedBet' | 'claimedRefund') => void;
    }
  | undefined
>(undefined);

function GlobalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState());
  const { address } = useAccount();
  const config = useConfig();
  const [bets, setBets] = useState<Bet[]>([]);
  const [eventUids, setEventUids] = useState<string[]>([]);
  const eventEmitter = useMemo(() => mitt<EmitEvent>(), []);

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
    query: { staleTime: 5 * 60 * 1000, enabled: !!eventUids.length },
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
      dispatch({
        type: 'setBets',
        payload: { address, bets: betsWithEvents },
      });
    }
  }, [eventData]);

  useEffect(() => {
    eventEmitter.on('placedBet', () => {
      reloadBets();
      toast.success('Bet placed');
    });
  }, [eventEmitter]);

  useEffect(() => {
    eventEmitter.on('claimedBet', () => {
      toast.success('Bet winnings claimed');
    });
  }, [eventEmitter]);

  useEffect(() => {
    eventEmitter.on('claimedRefund', () => {
      toast.success('Bet refund claimed');
    });
  }, [eventEmitter]);

  function waitTx(hash: `0x${string}`, type: 'placedBet' | 'claimedBet' | 'claimedRefund') {
    waitForTransactionReceipt(config, { hash }).then(() => eventEmitter.emit(type, hash));
  }

  return (
    <GlobalContext.Provider value={{ state, eventEmitter, dispatch, reloadBets, waitTx }}>
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
