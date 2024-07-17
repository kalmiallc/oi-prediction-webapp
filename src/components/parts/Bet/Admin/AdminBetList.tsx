import React, { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { useGlobalContext } from '@/contexts/global';
import { CircularProgress, Divider, Stack } from '@mui/material';
import classNames from 'classnames';
import { getContractAddressForEnv } from '@/lib/contracts';
import { betAbi } from '@/lib/abi';
import AdminBetListItem from './AdminBetListItem';

export default function AdminBetList({ className }: ComponentProps) {
  const {
    state: { timestamp },
  } = useGlobalContext();
  const [bets, setBets] = useState<Bet[]>([]);
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [eventUids, setEventUids] = useState<string[]>([]);

  const contract = {
    abi: betAbi,
    address: getContractAddressForEnv(process.env.NODE_ENV),
    query: { staleTime: 5 * 60 * 1000 },
  };
  const { data: betData, isLoading } = useReadContract({
    ...contract,
    functionName: 'getBetsByDate',
    args: [timestamp],
  });
  const { data: eventData, refetch } = useReadContract({
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
        refetch();
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
      {!!events?.length && !!bets?.length ? (
        <Stack gap={1} divider={<Divider flexItem className="text-gray" />}>
          <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] font-bold">
            <div className="col-span-1">Id</div>
            <div className="col-span-2">Match</div>
            <div className="col-span-2">Bet</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Multiplier</div>
            <div className="col-span-2">Result</div>
            <div className="col-span-2">Winnings</div>
            <div className="col-span-2">Wallet</div>
          </div>
          {bets.map(
            bet =>
              !!getEvent(bet.eventUID) && (
                <AdminBetListItem
                  key={bet.id}
                  bet={bet}
                  event={getEvent(bet.eventUID) as SportEvent}
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
