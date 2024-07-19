import React from 'react';
import { formatUnits } from 'viem';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import classNames from 'classnames';
import { Tooltip } from '@mui/material';
import useToken from '@/hooks/useToken';

dayjs.extend(relativeTime);

export default function AdminBetListItem({
  className,
  bet,
  event,
}: { bet: Bet; event: SportEvent; onClaim?: () => void } & ComponentProps) {
  const { token } = useToken();

  function parseBetAmount(amount: bigint) {
    return formatUnits(amount, 18);
  }

  const choice = event?.choices[bet.betChoice];
  const hasWon = event?.winner === choice?.choiceId;
  const pending = event?.winner === 0;
  return (
    <div
      className={classNames([
        'grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1 items-center overflow-hidden',
        className,
      ])}
    >
      <div>{Number(bet.id)}</div>
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
        <div className="truncate col-span-2">{event?.title}</div>
      </Tooltip>
      <div className="col-span-2">{choice?.choiceName}</div>
      <div className="col-span-2">
        {parseBetAmount(bet.betAmount)} {token}
      </div>
      <div className="col-span-2">x{(Number(bet.winMultiplier) / 1000).toFixed(2)}</div>
      <div className="col-span-2">
        {event &&
          (pending ? 'Pending' : event.choices.find(x => x.choiceId === event.winner)?.choiceName)}
      </div>
      <div className="col-span-2">
        {pending
          ? 'Pending'
          : hasWon
            ? (Number(parseBetAmount(bet.winMultiplier * bet.betAmount)) / 1000).toFixed(2) +
              ' ' +
              { token }
            : '0 ' + { token }}
      </div>
      <Tooltip
        title={bet.bettor}
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
        <div className="col-span-2 truncate">{bet.bettor}</div>
      </Tooltip>
    </div>
  );
}
