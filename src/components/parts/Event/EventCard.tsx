import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import EventBetInput from './EventBetInput';
import { formatEther } from 'viem';
import EventClaimButton from './EventClaimButton';
import { Tooltip } from '@mui/material';
dayjs.extend(relativeTime);

export default function EventCard({ className, event }: { event: SportEvent } & ComponentProps) {
  const [choices, setChoices] = useState([] as (Choice & { fake: boolean })[]);

  useEffect(() => {
    const chs = event.choices.map(x => ({ ...x, fake: false }));
    // insert fake draw choice if no draw
    if (chs.length === 2) {
      chs.splice(1, 0, {
        choiceId: 3,
        choiceName: 'vs',
        choiceIndex: 3,
        totalBetsAmount: 0n,
        currentMultiplier: 0n,
        fake: true,
      });
    }
    setChoices(
      chs?.sort((a, b) => {
        const orders = {
          [1]: 0,
          [2]: 2,
          [3]: 1,
        };
        return orders[a.choiceId] - orders[b.choiceId];
      })
    );
  }, [event.choices]);

  const hasStarted = dayjs(Number(event.startTime) * 1000).isBefore(dayjs());

  if (!choices.length) {
    return <></>;
  }
  return (
    <div className="relative mt-10 w-full">
      <div
        className={classNames([
          'absolute px-5 h-full z-0 w-full pt-3.5 -top-16 md:-top-10 rounded-t-[24px]',
          'bg-secondary text-white font-bold text-sm',
          'shadow-[0_4px_4px_0] shadow-black/25',
          'justify-between flex',
        ])}
      >
        <p>{event.title}</p>
        <p>Pool total: {Number(Number(formatEther(event.poolAmount)).toFixed(4)) + ' OI'} </p>
      </div>

      <div
        className={classNames([
          className,
          'rounded-[24px] pb-5 pt-2',
          'relative w-full bg-white shadow-[0_4px_4px_0] shadow-black/25',
        ])}
      >
        <Tooltip
          title={
            (hasStarted ? 'Started ' : 'Starts ') + dayjs(Number(event.startTime) * 1000).fromNow()
          }
          placement="top"
          PopperProps={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, -10],
                },
              },
            ],
          }}
        >
          <div className="text-xs text-center">
            {dayjs(Number(event.startTime) * 1000).format('MM/DD/YYYY HH:mm')}
          </div>
        </Tooltip>
        <div
          className={classNames([
            'grid gap-5 justify-items-center grid-cols-1 px-10 mt-4',
            'md:grid-cols-3',
          ])}
        >
          {choices.map((choice, i) => (
            <div className="w-full flex flex-col items-center" key={event.uid + '-' + i}>
              <h3 className={classNames(['typo-h2 text-center mb-6'])}>
                {choice.choiceId === 3 ? 'vs' : choice.choiceName}
              </h3>
              {event.cancelled ? (
                choice.choiceId === 3 && (
                  <div className="text-center text-lg text-primary pb-10">
                    <div>Match Cancelled!</div>
                    <EventClaimButton event={event} />
                  </div>
                )
              ) : event.winner === 0 && !hasStarted ? (
                !choice.fake && <EventBetInput event={event} choice={choice} />
              ) : (
                <div className="text-center text-lg text-primary pb-10">
                  {event.winner === choice.choiceId && (
                    <div>{choice.choiceId === 3 ? 'Draw!' : 'Winner!'}</div>
                  )}
                  <EventClaimButton event={event} choice={choice} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
