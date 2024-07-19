import React from 'react';
import { formatUnits } from 'viem';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import classNames from 'classnames';
import { TableCell, TableRow, Tooltip } from '@mui/material';
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
    <TableRow className={classNames([className])}>
      <TableCell>{Number(bet.id)}</TableCell>
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
        <TableCell className="truncate ">{event?.title}</TableCell>
      </Tooltip>
      <TableCell>{choice?.choiceName}</TableCell>
      <TableCell>
        {parseBetAmount(bet.betAmount)} {token}
      </TableCell>
      <TableCell>x{(Number(bet.winMultiplier) / 1000).toFixed(2)}</TableCell>
      <TableCell>
        {event &&
          (pending ? 'Pending' : event.choices.find(x => x.choiceId === event.winner)?.choiceName)}
      </TableCell>
      <TableCell>
        {pending
          ? 'Pending'
          : hasWon
            ? (Number(parseBetAmount(bet.winMultiplier * bet.betAmount)) / 1000).toFixed(2) +
              ' ' +
              token
            : '0 ' + token}
      </TableCell>
      <TableCell className=" truncate">{bet.bettor}</TableCell>
    </TableRow>
  );
}
