import classNames from 'classnames';
import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useAccount } from 'wagmi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import EventBetModal from './EventBetModal';

dayjs.extend(relativeTime);

export default function EventCard({ className, data }: { data: SportEvent } & ComponentProps) {
  const { isConnected } = useAccount();

  const [openBet, setOpenBet] = useState(null as any);
  const choices = data.choices;
  // Can't just sort since choice index is used as id
  // choices.sort((a, b) => {
  //   const orders = {
  //     [1]: 0,
  //     [2]: 2,
  //     [3]: 1,
  //   };
  //   return orders[a.choiceId] - orders[b.choiceId];
  // });

  async function onChoice(choiceIndex: number) {
    setOpenBet(choiceIndex);
  }

  return (
    <div className={classNames([className, 'border rounded-lg p-4', 'max-w-[600px] w-full'])}>
      <div className="flex justify-between mb-4 flex-wrap">
        <h3 className="text-lg">{data.title}</h3>
        <div className="text-sm">Starts {dayjs(Number(data.startTime) * 1000).fromNow()}</div>
      </div>
      <div className="flex justify-between flex-wrap  gap-2">
        {choices.map((choice, i) => (
          <div className="flex flex-col w-full md:w-auto" key={choice.choiceId}>
            <div className="text-sm text-center">
              x{(Number(choice.currentMultiplier) / 1000).toFixed(2)}
            </div>
            <Button
              variant="outlined"
              className=""
              disabled={!isConnected}
              onClick={() => onChoice(i)}
            >
              {choice.choiceName}
            </Button>
          </div>
        ))}
      </div>
      <EventBetModal data={data} choice={openBet} onClose={() => setOpenBet(null)} />
    </div>
  );
}
