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
import { betAbi, OIAbi } from '../lib/abi';
import { ContractType, getContractAddressForNetwork, Network } from '../lib/contracts';
import mitt, { Emitter } from 'mitt';
import { toast } from 'sonner';
import { formatUnits } from 'viem';
import { songbird, songbirdTestnet } from 'viem/chains';

// #region types
type Action =
  | {
      type: 'setBets';
      payload: { address: `0x${string}`; bets: BetWithEvent[] };
    }
  | { type: 'setTimestamp'; payload: number | undefined }
  | { type: 'setSidebarOpen'; payload: boolean }
  | { type: 'switchSidebarOpen' }
  | { type: 'setBalance'; payload: number }
  | { type: 'setAllowance'; payload: boolean }
  | { type: 'setNetwork'; payload: Network };

type State = {
  timestamp: number | undefined;
  bets: { [address: `0x${string}`]: BetWithEvent[] };
  sidebarOpen: boolean;
  balance: number;
  allowance: boolean;
  selectedNetwork: Network;
};

type TxTypes = 'placedBet' | 'claimedBet' | 'claimedRefund' | 'claimedToken';
// #endregion

const initialState = () =>
  ({
    timestamp: undefined,
    bets: {},
    events: [],
    sidebarOpen: false,
    balance: 0,
    allowance: false,
    selectedNetwork: Network.main,
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
    case 'setSidebarOpen': {
      return {
        ...state,
        sidebarOpen: action.payload,
      };
    }
    case 'switchSidebarOpen': {
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };
    }
    case 'setBalance': {
      return {
        ...state,
        balance: action.payload,
      };
    }
    case 'setAllowance': {
      return {
        ...state,
        allowance: action.payload,
      };
    }
    case 'setNetwork': {
      return {
        ...state,
        selectedNetwork: action.payload,
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
      reloadAllowance: () => void;
      waitTx: (hash: `0x${string}`, type: TxTypes) => void;
    }
  | undefined
>(undefined);

function GlobalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState());
  const { address, chainId } = useAccount();
  const config = useConfig();
  const [bets, setBets] = useState<Bet[]>([]);
  const [eventUids, setEventUids] = useState<string[]>([]);
  const eventEmitter = useMemo(() => mitt<EmitEvent>(), []);

  const contract = {
    abi: betAbi,
    address: getContractAddressForNetwork(ContractType.BET_SHOWCASE, state.selectedNetwork),
    chainId: state.selectedNetwork,
  };

  const tokenContract = {
    abi: OIAbi,
    address: getContractAddressForNetwork(ContractType.OI_TOKEN, state.selectedNetwork),
    chainId: state.selectedNetwork,
  };

  const { data: betData, refetch: reloadBets } = useReadContract({
    ...contract,
    functionName: 'getBetsByUser',
    args: [address],
    query: { staleTime: 5 * 60 * 1000, enabled: !!address },
  });

  const { data: eventData, refetch: refetchEvents } = useReadContract({
    ...contract,
    functionName: 'getEvents',
    args: [eventUids],
    query: { staleTime: 5 * 60 * 1000, enabled: !!eventUids.length },
  });

  const { data: balanceData, refetch: reloadBalance } = useReadContract({
    ...tokenContract,
    functionName: 'balanceOf',
    args: [address],
    query: { staleTime: 1 * 60 * 1000, enabled: !!address },
  });

  const { data: allowanceData, refetch: reloadAllowance } = useReadContract({
    ...tokenContract,
    functionName: 'allowance',
    args: [address, contract.address],
    query: { staleTime: 1 * 60 * 1000, enabled: !!address && !!contract.address },
  });

  useEffect(() => {
    if (Array.isArray(betData) && betData.length) {
      setBets(betData);
      setEventUids([...new Set(betData.map(x => x.eventUID))]);
      refetchEvents();
    } else {
      setBets([]);
      setEventUids([]);
    }
  }, [betData, address]);

  useEffect(() => {
    if (Array.isArray(eventData) && eventData.length && address) {
      if (
        eventData[0].uid === '0x0000000000000000000000000000000000000000000000000000000000000000'
      ) {
        dispatch({
          type: 'setBets',
          payload: { address, bets: [] },
        });
      } else {
        const betsWithEvents = bets.map(bet => ({
          ...bet,
          event: eventData.find(event => event.uid == bet.eventUID),
        }));
        dispatch({
          type: 'setBets',
          payload: { address, bets: betsWithEvents },
        });
      }
    }
  }, [eventData, address]);

  useEffect(() => {
    if (!address || !balanceData) {
      dispatch({
        type: 'setBalance',
        payload: 0,
      });
    }
    if (balanceData) {
      dispatch({
        type: 'setBalance',
        payload: Number(Number(formatUnits(BigInt(balanceData as any), 18)).toFixed(4)),
      });
    }
  }, [balanceData, address]);

  useEffect(() => {
    if ((Number(allowanceData) || 0) > 1_000_000) {
      dispatch({
        type: 'setAllowance',
        payload: true,
      });
    } else {
      dispatch({
        type: 'setAllowance',
        payload: false,
      });
    }
  }, [allowanceData, address]);

  useEffect(() => {
    eventEmitter.on('placedBet', () => {
      reloadBets();
      reloadBalance();
      toast.success('Bet placed');
    });
    eventEmitter.on('claimedBet', () => {
      reloadBalance();
      toast.success('Bet winnings claimed');
    });
    eventEmitter.on('claimedRefund', () => {
      reloadBalance();
      toast.success('Bet refund claimed');
    });
    eventEmitter.on('claimedToken', () => {
      reloadBalance();
      toast.success('OI Coins claimed');
    });
  }, [eventEmitter]);

  useEffect(() => {
    if (
      (chainId === songbird.id || chainId === songbirdTestnet.id) &&
      chainId !== state.selectedNetwork
    ) {
      dispatch({ type: 'setNetwork', payload: chainId });
      reloadBets();
    }
  }, [chainId]);

  function waitTx(hash: `0x${string}`, type: TxTypes) {
    waitForTransactionReceipt(config, { hash }).then(() => eventEmitter.emit(type, hash));
  }

  return (
    <GlobalContext.Provider
      value={{ state, eventEmitter, dispatch, reloadBets, reloadAllowance, waitTx }}
    >
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
