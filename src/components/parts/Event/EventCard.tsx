import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import EventBetConfirmModal from './EventBetConfirmModal';
import EventBetInput from './EventBetInput';
import { formatEther } from 'viem';
dayjs.extend(relativeTime);

export default function EventCard({ className, event }: { event: SportEvent } & ComponentProps) {
  const [betData, setBetData] = useState(null as { choice: number; amount: number } | null);
  const [choices, setChoices] = useState(
    event.choices?.sort((a, b) => {
      const orders = {
        [1]: 0,
        [2]: 2,
        [3]: 1,
      };
      return orders[a.choiceId] - orders[b.choiceId];
    })
  );
  const hasDraw = choices.length > 2;

  function onBet(amount: number, choiceIndex: number) {
    setBetData({ amount, choice: choiceIndex });
  }
  useEffect(() => {
    setChoices(
      event.choices?.sort((a, b) => {
        const orders = {
          [1]: 0,
          [2]: 2,
          [3]: 1,
        };
        return orders[a.choiceId] - orders[b.choiceId];
      })
    );
  }, [event.choices]);
  return (
    <div className="relative mt-10 w-full">
      <div
        className={classNames([
          'absolute px-5 h-full z-0 w-full pt-3.5 -top-10 rounded-t-[24px]',
          'bg-secondary text-white font-bold text-sm',
          'shadow-[0_4px_4px_0] shadow-black/25',
          'justify-between flex',
        ])}
      >
        <p>{event.title}</p>
        <p>Pool total: {formatEther(event.poolAmount)} FLR</p>
      </div>

      <div
        className={classNames([
          className,
          'rounded-[24px] pb-5 pt-2',
          'relative w-full bg-white shadow-[0_4px_4px_0] shadow-black/25',
        ])}
      >
        <div className="text-xs text-center">
          Starts {dayjs(Number(event.startTime) * 1000).fromNow()}
        </div>
        <div
          className={classNames([
            'grid gap-5 justify-items-center grid-cols-1 px-10 mt-4',
            'md:grid-cols-3',
          ])}
        >
          {choices.map((choice, i) => (
            <>
              <div key={event.uid + '-' + i}>
                <h3 className={classNames(['font-bold text-[22px] text-center mb-6'])}>
                  {choice.choiceId === 3 ? 'vs' : choice.choiceName}
                </h3>
                {event.winner === 0 ? (
                  <EventBetInput
                    event={event}
                    choice={choice}
                    onBet={x => onBet(x, choice.choiceIndex as number)}
                  />
                ) : (
                  <div className="text-center text-gray pb-10">
                    {event.winner === choice.choiceId && (
                      <div>{choice.choiceId === 3 ? 'Draw!' : 'Winner!'}</div>
                    )}
                  </div>
                )}
              </div>
              {!hasDraw && i === 0 && (
                <div
                  key={event.uid + '-' + 2}
                  className={classNames(['font-bold text-[22px] text-center mb-6 hidden md:block'])}
                >
                  vs
                </div>
              )}
            </>
          ))}
        </div>
        <EventBetConfirmModal event={event} data={betData} onClose={() => setBetData(null)} />
      </div>
    </div>
  );
}
