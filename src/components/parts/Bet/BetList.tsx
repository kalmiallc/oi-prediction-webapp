import React, { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { useGlobalContext } from '@/contexts/global';
import { CircularProgress, TableContainer } from '@mui/material';
import classNames from 'classnames';
import dayjs from 'dayjs';
import BetListTable from './BetListTable';

export default function BetList({
  className,
  timestamp,
}: { timestamp: number | null } & ComponentProps) {
  const {
    dispatch,
    state: { bets: addressBets },
  } = useGlobalContext();
  const { address } = useAccount();
  const [bets, setBets] = useState<BetWithEvent[]>([]);

  const isLoading = false;

  useEffect(() => {
    if (address && addressBets?.[address]?.length) {
      setBets(addressBets?.[address]);
    } else {
      setBets([]);
    }
  }, [addressBets, address]);

  function getSod(time: number) {
    const timestamp = dayjs(time * 1000)
      .endOf('d')
      .unix();
    return Math.floor(timestamp - (timestamp % 86400));
  }

  function onClaim(bet: BetWithEvent) {
    if (!address) {
      return;
    }
    // Set claimed to true on claim
    dispatch({
      type: 'setBets',
      payload: {
        address,
        bets: bets.map(x => (x.id === bet.id ? { ...x, claimed: true } : x)) as BetWithEvent[],
      },
    });
  }

  const filteredBets = useMemo(() => {
    return timestamp ? bets.filter(x => getSod(Number(x.event.startTime)) === timestamp) : bets;
  }, [bets, timestamp]);

  return (
    <TableContainer className={classNames([className], 'bg-white rounded-[24px]', 'p-2')}>
      {isLoading ? (
        <div className="text-center p-10">
          <CircularProgress size={40} />
        </div>
      ) : !!address && !!filteredBets.length ? (
        <BetListTable bets={filteredBets} onClaim={onClaim} />
      ) : (
        <div className="p-10">{timestamp ? 'No bets placed for this day' : 'No bets placed'}</div>
      )}
    </TableContainer>
  );
}
