import React from 'react';
import { useAccount } from 'wagmi';
import { useGlobalContext } from '@/contexts/global';
import { formatUnits } from 'viem';
import { Button, Divider, Stack } from '@mui/material';
import dayjs from 'dayjs';
import useContract from '@/hooks/useContract';
import classNames from 'classnames';

export default function EventBetList({
  event,
}: { event: SportEvent; choice: number } & ComponentProps) {
  const { state } = useGlobalContext();
  const { address } = useAccount();
  const { claimBet } = useContract();

  const bets = address ? state.bets?.[address]?.filter(x => x.eventUUID === event.uuid) : [];
  function parseBetAmount(amount: bigint) {
    return formatUnits(amount, 18);
  }

  return (
    <div>
      {!!address && !!bets?.length && (
        <div className="mt-6">
          <div className="text-lg font-bold mb-2">Your Bets</div>
          <Stack gap={1} divider={<Divider flexItem />}>
            <div className="flex justify-between font-bold text-sm ">
              <div>Bet</div>
              <div>Amount</div>
              <div>Time</div>
              {event.winner !== 0 && <div></div>}
            </div>
            {bets.map(bet => (
              <div
                key={bet.id}
                className={classNames([
                  'grid ',
                  event.winner !== 0 ? 'grid-cols-4' : 'grid-cols-3',
                ])}
              >
                <div>{event.choices[bet.betChoice]?.choiceName}</div>
                <div className="text-center">
                  {parseBetAmount(bet.betAmount)}
                  <span className="text-xs ml-1">
                    x{(Number(bet.winMultiplier) / 1000).toFixed(2)}
                  </span>
                </div>
                <div className="text-end">{dayjs(Number(bet.betTimestamp) * 1000).fromNow()}</div>

                {event.winner !== 0 && (
                  <div className="text-center">
                    <Button className="" size="small" onClick={() => claimBet(bet.id)}>
                      Claim
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </Stack>
        </div>
      )}
    </div>
  );
}
