import React from 'react';
import { Button, CircularProgress, Dialog } from '@mui/material';
import useContract from '@/hooks/useContract';
import { toast } from 'sonner';
import EventBetMultiplier from './EventBetMultiplier';

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
      await placeBet(event.uid, data.choice, data.amount);
      onClose();
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
      <div className="p-2.5 min-w-[min(300px,80vw)] ">
        <div className="px-4 pt-2">
          <div className="mb-4">
            <h1 className="text-xl">{event.title}</h1>
            <h2>Bet for {event.choices?.[data.choice as any]?.choiceName}</h2>
          </div>
          <div className="text-gray">
            Bet amount: <span className="text-black font-bold">{data.amount}</span>
          </div>
          <EventBetMultiplier
            className="text-base"
            event={event.uid}
            choice={data.choice}
            initial={Number(event.choices?.[data.choice]?.currentMultiplier) / 1000}
            amount={data.amount}
          />
        </div>
        <div className="flex mt-4 gap-2.5">
          <Button disabled={isPending} variant="outlined" className="w-full" onClick={onClose}>
            {isPending && <CircularProgress size={12} className="absolute" />}
            Cancel
          </Button>
          <Button disabled={isPending} variant="contained" className="w-full" onClick={onBet}>
            {isPending && <CircularProgress size={12} className="absolute" />}
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
