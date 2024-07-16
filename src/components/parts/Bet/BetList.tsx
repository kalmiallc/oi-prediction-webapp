import React, { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useGlobalContext } from '@/contexts/global';
import { CircularProgress, Divider, Stack } from '@mui/material';
import BetListItem from './BetListItem';
import classNames from 'classnames';
import { getContractAddressForEnv } from '@/lib/contracts';
import { betAbi } from '@/lib/abi';

export default function BetList({ className }: ComponentProps) {
  const {
    state: { timestamp },
  } = useGlobalContext();
  const { address } = useAccount();
  const [bets, setBets] = useState<Bet[]>([]);
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [eventUids, setEventUids] = useState<string[]>([]);

  const contract = {
    abi: betAbi,
    address: getContractAddressForEnv(process.env.NODE_ENV),
  };
  const {
    data: betData,
    refetch: refetchBets,
    isLoading,
  } = useReadContract({
    ...contract,
    functionName: 'getBetsByDateAndUser',
    args: [timestamp, address],
    query: { staleTime: 5 * 60 * 1000 },
  });
  const { data: eventData, refetch: refetchEvents } = useReadContract({
    ...contract,
    functionName: 'getEvents',
    args: [eventUids],
  });

  function getEvent(uid: string) {
    return events.find(x => x.uid === uid);
  }

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
    if (Array.isArray(eventData)) {
      if (eventData.length) {
        setEvents(eventData);
      }
    }
  }, [eventData]);

  return (
    <div className={classNames([className], 'bg-white rounded-[24px]', 'px-8 py-10')}>
      {!!address && !!events?.length && !!bets?.length ? (
        <Stack gap={1} divider={<Divider flexItem className="text-gray" />}>
          <div className="grid grid-cols-6 font-bold">
            <div>Bet</div>
            <div>Amount</div>
            <div>Multiplier</div>
            <div>Result</div>
            <div>Winnings</div>
            <div></div>
          </div>
          {bets.map(
            bet =>
              !!getEvent(bet.eventUID) && (
                <BetListItem
                  key={bet.id}
                  bet={bet}
                  event={getEvent(bet.eventUID) as SportEvent}
                  onClaim={refetchBets}
                />
              )
          )}
        </Stack>
      ) : isLoading ? (
        <div className="text-center">
          <CircularProgress size={40} />
        </div>
      ) : (
        <div>No bets placed this day</div>
      )}
    </div>
  );
}
