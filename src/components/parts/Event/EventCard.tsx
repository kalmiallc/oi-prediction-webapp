import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import EventBetConfirmModal from './EventBetConfirmModal';
import EventBetInput from './EventBetInput';
import { formatEther } from 'viem';
import EventClaimButton from './EventClaimButton';
import useToken from '@/hooks/useToken';
import { songbird } from 'viem/chains';
dayjs.extend(relativeTime);

export default function EventCard({
  className,
  event,
  onBet: onBetConfirm,
}: { event: SportEvent; onBet: () => void } & ComponentProps) {
  const [betData, setBetData] = useState(null as { choice: number; amount: number } | null);
  const [choices, setChoices] = useState([] as (Choice & { fake: boolean })[]);
  const { token } = useToken();
  function onBet(amount: number, choiceIndex: number) {
    setBetData({ amount, choice: choiceIndex });
  }
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
        <p>Pool total: {formatEther(event.poolAmount) + ' ' + token} </p>
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
            <div className="w-full flex flex-col items-center" key={event.uid + '-' + i}>
              <h3 className={classNames(['font-bold text-[22px] text-center mb-6'])}>
                {choice.choiceId === 3 ? 'vs' : choice.choiceName}
              </h3>
              {event.cancelled ? (
                choice.choiceId === 3 && (
                  <div className="text-center text-gray pb-10">
                    <div>Match Cancelled!</div>
                    <EventClaimButton event={event} />
                  </div>
                )
              ) : event.winner === 0 ? (
                !choice.fake && (
                  <EventBetInput
                    event={event}
                    choice={choice}
                    onBet={x => onBet(x, choice.choiceIndex as number)}
                  />
                )
              ) : (
                <div className="text-center text-gray pb-10">
                  {event.winner === choice.choiceId && (
                    <div>{choice.choiceId === 3 ? 'Draw!' : 'Winner!'}</div>
                  )}
                  <EventClaimButton event={event} choice={choice} />
                </div>
              )}
            </div>
          ))}
        </div>
        <EventBetConfirmModal
          event={event}
          data={betData}
          onClose={() => setBetData(null)}
          onConfirm={onBetConfirm}
        />
      </div>
    </div>
  );
}
