import React, { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { useGlobalContext } from '@/contexts/global';
import { CircularProgress, TableContainer } from '@mui/material';
import classNames from 'classnames';
import { getContractAddressForEnv } from '@/lib/contracts';
import { betAbi } from '@/lib/abi';
import AdminBetListTable from './AdminBetListTable';

export default function AdminBetList({ className }: ComponentProps) {
  const {
    state: { timestamp },
  } = useGlobalContext();
  const [bets, setBets] = useState<Bet[]>([]);
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [betsHelper, setBetsHelper] = useState<{ [key: number]: Bet[] }>({});
  const [eventUids, setEventUids] = useState<string[]>([]);
  const [pag, setPag] = useState<{ from: number; to: number }>({ from: 0, to: 0 });
  const [isLoading, setLoading] = useState(true);

  const contract = {
    abi: betAbi,
    address: getContractAddressForEnv(process.env.NODE_ENV),
  };
  const { data: betsLength } = useReadContract({
    ...contract,
    functionName: 'betsByEventStartDateLength',
    args: [timestamp],
    query: { staleTime: 5 * 60 * 1000, enabled: !!timestamp },
  });
  const { data: betData, isLoading: isLoadingBets } = useReadContract({
    ...contract,
    functionName: 'getBetsByDateFromTo',
    args: [timestamp, pag.from, pag.to],
    query: { staleTime: 5 * 60 * 1000, enabled: !!timestamp && !!pag.to },
  });
  const { data: eventData, isLoading: isLoadingEvents } = useReadContract({
    ...contract,
    functionName: 'getEvents',
    args: [eventUids],
    query: { staleTime: 5 * 60 * 1000, enabled: !!eventUids.length },
  });

  useEffect(() => {
    const length = Number(betsLength);
    if (!length) {
      setBets([]);
    }
    if (length > 500) {
      setPag({ from: 0, to: 500 });
    } else {
      setPag({ from: 0, to: length });
    }
  }, [betsLength]);

  useEffect(() => {
    if (!pag.to) {
      setLoading(false);
      return;
    }
    if (Array.isArray(betData) && betData.length) {
      const length = Number(betsLength);
      setLoading(true);
      if (pag.from === 0) {
        setBetsHelper({ [pag.to]: betData });
      } else {
        setBetsHelper({ ...betsHelper, [pag.to]: betData });
      }
      if (pag.to !== length) {
        setPag({ from: pag.from + 500, to: Math.min(pag.to + 500, Number(betsLength)) });
      } else {
        setLoading(false);
        setPag({ from: 0, to: 0 });
      }
    } else {
      setBets([]);
      setLoading(false);
    }
  }, [betData]);

  useEffect(() => {
    if (Object.values(betsHelper).length && betsHelper[Number(betsLength)]?.length && !isLoading) {
      const arr = [...Object.values(betsHelper).flat()];
      setEventUids([...new Set(arr.map(x => x.eventUID))]);
      setBets(arr);
    }
  }, [betsHelper]);

  useEffect(() => {
    if (Array.isArray(eventData)) {
      if (eventData.length) {
        setEvents(eventData);
      }
    }
  }, [eventData]);

  return (
    <div>
      <TableContainer
        className={classNames([className], 'bg-white rounded-[24px] max-w-[1400px]', 'px-2')}
      >
        {isLoading || isLoadingBets || isLoadingEvents ? (
          <div className="text-center p-10">
            <CircularProgress size={40} />
          </div>
        ) : !!events?.length && !!bets?.length ? (
          <AdminBetListTable bets={bets} events={events} />
        ) : (
          <div className="p-10">No bets placed this day</div>
        )}
      </TableContainer>
    </div>
  );
}
