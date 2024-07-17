import React, { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { useGlobalContext } from '@/contexts/global';
import { CircularProgress, Divider, Stack } from '@mui/material';
import BetListItem from './BetListItem';
import classNames from 'classnames';
import dayjs from 'dayjs';

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
    <div className={classNames([className], 'bg-white rounded-[24px]', 'px-8 py-10')}>
      {!!address && !!filteredBets?.length ? (
        <Stack gap={1} divider={<Divider flexItem className="text-gray" />}>
          <div className="grid grid-cols-7 font-bold">
            <div>Match</div>
            <div>Bet</div>
            <div>Amount</div>
            <div>Multiplier</div>
            <div>Result</div>
            <div>Winnings</div>
            <div></div>
          </div>
          {filteredBets.map(
            bet =>
              !!bet.event && (
                <BetListItem
                  key={bet.id}
                  bet={bet}
                  event={bet.event as SportEvent}
                  onClaim={() => onClaim(bet)}
                />
              )
          )}
        </Stack>
      ) : isLoading ? (
        <div className="text-center">
          <CircularProgress size={40} />
        </div>
      ) : (
        <div>{timestamp ? 'No bets placed for this day' : 'No bets placed'}</div>
      )}
    </div>
  );
}
