import React, { useState } from 'react';
import { formatUnits } from 'viem';
import { Button, TableCell, TableRow, Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import BetClaimModal from './BetClaimModal';
import BetRefundModal from './BetRefundModal';
import useToken from '@/hooks/useToken';

dayjs.extend(relativeTime);

export default function BetListItem({
  bet,
  event,
  onClaim,
  onRefund,
}: { bet: Bet; event: SportEvent; onClaim?: () => void; onRefund?: () => void } & ComponentProps) {
  const [showClaim, setShowClaim] = useState<boolean>(false);
  const [showRefund, setShowRefund] = useState<boolean>(false);
  const { token } = useToken();

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
    <TableRow>
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
        <TableCell className="truncate">{event?.title}</TableCell>
      </Tooltip>
      <TableCell>{dayjs(Number(event.startTime) * 1000).format('MM/DD/YYYY HH:mm')}</TableCell>
      <TableCell>{choice?.choiceName}</TableCell>
      <TableCell>
        {Number(parseBetAmount(bet.betAmount)).toFixed(1)} {token}
      </TableCell>
      <TableCell>x{(Number(bet.winMultiplier) / 1000).toFixed(2)}</TableCell>
      <TableCell>
        {event &&
          (cancelled
            ? 'Cancelled'
            : pending
              ? 'Pending'
              : event.choices.find(x => x.choiceId === event.winner)?.choiceName)}
      </TableCell>
      <TableCell>
        {cancelled
          ? 'Cancelled'
          : pending
            ? 'Pending'
            : hasWon
              ? (Number(parseBetAmount(bet.winMultiplier * bet.betAmount)) / 1000).toFixed(2) +
                ' ' +
                token
              : '0 ' + token}
      </TableCell>
      <TableCell className="text-center">
        {pending || hasWon ? (
          cancelled ? (
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
          )
        ) : (
          <div></div>
        )}
      </TableCell>
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
    </TableRow>
  );
}
