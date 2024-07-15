import React from 'react';
import { useAccount } from 'wagmi';
import { useGlobalContext } from '@/contexts/global';
import { formatUnits } from 'viem';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useContract from '@/hooks/useContract';
import classNames from 'classnames';

dayjs.extend(relativeTime);

export default function EventBetListItem({
  className,
  bet,
  event,
}: { bet: Bet; event?: SportEvent } & ComponentProps) {
  const {
    state: { events },
  } = useGlobalContext();
  const { address } = useAccount();
  const { claimBet } = useContract();

  function parseBetAmount(amount: bigint) {
    return formatUnits(amount, 18);
  }

  const choice = event?.choices[bet.betChoice];
  return (
    <div className={classNames(['grid grid-cols-6', className])}>
      <div>{choice?.choiceName}</div>
      <div>{parseBetAmount(bet.betAmount)}</div>
      <div>x{(Number(bet.winMultiplier) / 1000).toFixed(2)}</div>
      <div>
        {event?.winner
          ? event.choices.find(x => x.choiceId === event.winner)?.choiceName
          : 'Pending'}
      </div>
      <div>{((Number(bet.winMultiplier) / 1000) * +parseBetAmount(bet.betAmount)).toFixed(4)}</div>
      {event?.winner === choice?.choiceId && (
        <div className="text-end">
          <Button
            className="normal-case min-w-[140px]"
            variant="outlined"
            onClick={() => claimBet(bet.id)}
          >
            Claim
          </Button>
        </div>
      )}
    </div>
  );
}
