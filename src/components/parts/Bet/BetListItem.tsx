import React, { useState } from 'react';
import { formatUnits } from 'viem';
import { Button, Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import classNames from 'classnames';
import BetClaimModal from './BetClaimModal';
import BetRefundModal from './BetRefundModal';
import { useAccount, useBalance } from 'wagmi';

dayjs.extend(relativeTime);

export default function BetListItem({
  className,
  bet,
  event,
  onClaim,
  onRefund,
}: { bet: Bet; event: SportEvent; onClaim?: () => void; onRefund?: () => void } & ComponentProps) {
  const [showClaim, setShowClaim] = useState<boolean>(false);
  const [showRefund, setShowRefund] = useState<boolean>(false);

  function parseBetAmount(amount: bigint) {
    return formatUnits(amount, 18);
  }

  function claimBet() {
    setShowClaim(true);
  }

  function refundBet() {
    setShowRefund(true);
  }

  const choice = event?.choices[bet.betChoice];
  const hasWon = event?.winner === choice?.choiceId;
  const pending = event?.winner === 0;
  const cancelled = event?.cancelled;
  return (
    <div className={classNames(['grid grid-cols-7 gap-1 items-center min-h-[35px]', className])}>
      <Tooltip
        title={event?.title}
        placement="top"
        PopperProps={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -14],
              },
            },
          ],
        }}
      >
        <div className="truncate">{event?.title}</div>
      </Tooltip>
      <div>{choice?.choiceName}</div>
      <div>{Number(parseBetAmount(bet.betAmount)).toFixed(1)} SGB</div>
      <div>x{(Number(bet.winMultiplier) / 1000).toFixed(2)}</div>
      <div>
        {event &&
          (cancelled
            ? 'Cancelled'
            : pending
              ? 'Pending'
              : event.choices.find(x => x.choiceId === event.winner)?.choiceName)}
      </div>
      <div>
        {cancelled
          ? 'Cancelled'
          : pending
            ? 'Pending'
            : hasWon
              ? (Number(parseBetAmount(bet.winMultiplier * bet.betAmount)) / 1000).toFixed(2) +
                ' SGB'
              : '0 SGB'}
      </div>
      {(pending || hasWon) && (
        <div className="text-center">
          {cancelled ? (
            bet.claimed ? (
              <p className="text-gray">Already Refunded</p>
            ) : (
              <Button
                className="normal-case min-w-[140px] py-1"
                variant="outlined"
                size="medium"
                onClick={() => refundBet()}
              >
                Refund
              </Button>
            )
          ) : bet.claimed ? (
            <p className="text-gray">Already Claimed</p>
          ) : (
            <Button
              disabled={!hasWon}
              className="normal-case min-w-[140px] py-1"
              variant="outlined"
              size="medium"
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
      <BetRefundModal
        open={showRefund}
        bet={bet}
        event={event}
        onClose={() => setShowRefund(false)}
        onRefund={onRefund}
      />
    </div>
  );
}
