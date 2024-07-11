import React from 'react';
import { Button, CircularProgress, Dialog } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useContract from '@/hooks/useContract';
import { toast } from 'sonner';
import EventBetMultiplier from './EventBetMultiplier';
import EventBetList from './EventBetList';

dayjs.extend(relativeTime);

export default function EventBetModal({
  className,
  event,
  data,
  onClose,
}: {
  event: SportEvent;
  data: { choice: number; amount: number } | null;
  onClose: () => void;
} & ComponentProps) {
  const { placeBet, isPending } = useContract();

  async function onBet() {
    try {
      if (!data) {
        return;
      }
      await placeBet(event.uuid, data.choice, data.amount);
      toast.success('Bet placed');
    } catch (error: any) {
      if (error?.shortMessage) {
        toast.error(error?.shortMessage);
      }
      console.log(error);
    }
  }
  if (!data) {
    return <></>;
  }

  return (
    <Dialog open={!!data?.choice?.toString()} onClose={() => onClose?.()} className={className}>
      <div className="p-4 md:p-10 min-w-[min(500px,80vw)] ">
        <div className="mb-4">
          <h1 className="text-xl">{event.title}</h1>
          <h2>Bet for {event.choices?.[data.choice as any]?.choiceName}</h2>
        </div>
        <div className="text-gray">
          Bet amount: <span className="text-black font-bold">{data.amount}</span>
        </div>
        <EventBetMultiplier
          className="text-base"
          event={event.uuid}
          choice={data.choice}
          initial={Number(event.choices?.[data.choice]?.currentMultiplier) / 1000}
          amount={data.amount}
        />
        <Button disabled={isPending} variant="contained" className="w-full mt-4" onClick={onBet}>
          {isPending && <CircularProgress size={12} className="absolute" />}
          Confirm Bet
        </Button>
        <EventBetList event={event} choice={data.choice} />
      </div>
    </Dialog>
  );
}
