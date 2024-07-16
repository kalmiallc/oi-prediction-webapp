import React, { useState } from 'react';
import { formatUnits } from 'viem';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import classNames from 'classnames';
import BetClaimModal from './BetClaimModal';

dayjs.extend(relativeTime);

export default function BetListItem({
  className,
  bet,
  event,
  onClaim,
}: { bet: Bet; event: SportEvent; onClaim?: () => void } & ComponentProps) {
  const [showClaim, setShowClaim] = useState<boolean>(false);

  function parseBetAmount(amount: bigint) {
    return formatUnits(amount, 18);
  }

  function claimBet() {
    setShowClaim(true);
  }

  const choice = event?.choices[bet.betChoice];
  const hasWon = event?.winner === choice?.choiceId;
  const pending = event?.winner === 0;
  return (
    <div className={classNames(['grid grid-cols-6 items-center', className])}>
      <div>{choice?.choiceName}</div>
      <div>{parseBetAmount(bet.betAmount)} FLR</div>
      <div>x{(Number(bet.winMultiplier) / 1000).toFixed(2)}</div>
      <div>
        {event &&
          (pending ? 'Pending' : event.choices.find(x => x.choiceId === event.winner)?.choiceName)}
      </div>
      <div>
        {pending
          ? 'Pending'
          : hasWon
            ? (Number(parseBetAmount(bet.winMultiplier * bet.betAmount)) / 1000).toFixed(2) + ' FLR'
            : '0 FLR'}
      </div>
      {(pending || hasWon) && (
        <div className="text-center">
          {bet.claimed ? (
            <p className="text-gray">Claimed already</p>
          ) : (
            <Button
              disabled={!hasWon}
              className="normal-case min-w-[140px]"
              variant="outlined"
              onClick={() => claimBet()}
            >
              Claim
            </Button>
          )}
        </div>
      )}
      <BetClaimModal
        open={showClaim}
        bet={bet}
        event={event}
        onClose={() => setShowClaim(false)}
        onClaim={onClaim}
      />
    </div>
  );
}
