import React, { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useGlobalContext } from '@/contexts/global';
import { Divider, Stack } from '@mui/material';
import EventBetListItem from './EventBetListItem';
import classNames from 'classnames';
import { ContractType, getContractAddressForEnv } from '../../../lib/contracts';
import { betAbi } from '../../../lib/abi';

export default function EventBetList({ className }: ComponentProps) {
  const {
    state: { timestamp },
  } = useGlobalContext();
  const { address } = useAccount();
  const [bets, setBets] = useState<Bet[]>([]);
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [eventUids, setEventUids] = useState<string[]>([]);

  const contract = {
    abi: betAbi,
    address: getContractAddressForEnv(ContractType.BET_SHOWCASE, process.env.NODE_ENV),
  };
  const { data: betData } = useReadContract({
    ...contract,
    functionName: 'getBetsByDateAndUser',
    args: [timestamp, address],
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
      {!!address && !!events?.length && !!bets?.length ? (
        <Stack gap={1} divider={<Divider flexItem className="text-gray" />}>
          <div className="grid grid-cols-6 font-bold">
            <div>Bet</div>
            <div>Amount</div>
            <div>Multiplier</div>
            <div>Result</div>
            <div>Winnings</div>
            <div className="col-span-2"></div>
          </div>
          {bets.map(bet => (
            <EventBetListItem key={bet.id} bet={bet} event={getEvent(bet.eventUID)} />
          ))}
        </Stack>
      ) : (
        <div>No bets placed this day</div>
      )}
    </div>
  );
}
