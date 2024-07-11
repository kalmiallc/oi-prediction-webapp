import classNames from 'classnames';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import EventBetModal from './EventBetModal';
import EventBetInput from './EventBetInput';

dayjs.extend(relativeTime);

export default function EventCard({ className, event }: { event: SportEvent } & ComponentProps) {
  const [betData, setBetData] = useState(null as { choice: number; amount: number } | null);
  const choices = event.choices;
  choices?.sort((a, b) => {
    const orders = {
      [1]: 0,
      [2]: 2,
      [3]: 1,
    };
    return orders[a.choiceId] - orders[b.choiceId];
  });
  const hasDraw = choices.length > 2;

  function onBet(amount: number, choiceIndex: number) {
    setBetData({ amount, choice: choiceIndex });
  }

  const titleString = event.title?.replace('-', 'vs').split(hasDraw ? ' ' : ' vs ');

  return (
    <div className={classNames([className, 'rounded-[24px] pb-5 pt-2', 'w-full bg-white'])}>
      <div className="text-xs text-center">
        Starts {dayjs(Number(event.startTime) * 1000).fromNow()}
      </div>
      <div
        className={classNames([
          'grid mt-4 mb-6 text-center items-center md:grid-cols-3 grid-cols-1',
        ])}
      >
        {titleString.map((x, i) => (
          <h3 className={classNames(['font-bold text-[22px]'])} key={i}>
            {x}
          </h3>
        ))}
      </div>
      <div
        className={classNames([
          'grid gap-5 justify-items-center grid-cols-1 px-10',
          hasDraw ? 'md:grid-cols-3' : 'md:grid-cols-2',
        ])}
      >
        {choices.map(choice => (
          <EventBetInput
            key={choice.choiceId}
            event={event}
            choice={choice}
            onBet={x => onBet(x, choice.choiceIndex as number)}
          />
        ))}
      </div>
      <EventBetModal event={event} data={betData} onClose={() => setBetData(null)} />
    </div>
  );
}
