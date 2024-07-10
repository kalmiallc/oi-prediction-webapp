import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Dialog } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useContract from '@/hooks/useContract';
import { z } from 'zod';
import useFormSchema from '../../../hooks/useFormSchema';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import useDebounce from '../../../hooks/useDebounce';
import EventBetMultiplier from './EventBetMultiplier';
import NumberInput from '@/components/inputs/NumberInput';
import EventBetList from './EventBetList';

dayjs.extend(relativeTime);

export default function EventBetModal({
  className,
  data,
  choice,
  onClose,
}: { data: SportEvent; choice: number; onClose: () => void } & ComponentProps) {
  const { placeBet, isPending } = useContract();

  const { debounce } = useDebounce();

  const [debouncedBet, setDebouncedBet] = useState(0);

  const maxAmount = Number(data.poolAmount);

  async function onBet(amount: number) {
    try {
      await placeBet(data.uuid, choice, amount);
      toast.success('Bet placed');
    } catch (error: any) {
      if (error?.shortMessage) {
        toast.error(error?.shortMessage);
      }
      console.log(error);
    }
  }

  const schema = z.object({
    bet: z.number().min(1, 'Invalid amount').max(maxAmount, 'Invalid amount'),
  });

  const {
    control,
    handleSubmit,
    watch,

    formState: { errors },
  } = useFormSchema(schema);

  const watchBet = watch('bet');

  useEffect(() => {
    if (watchBet < maxAmount) {
      debounce(() => {
        setDebouncedBet(watchBet);
      }, 2000);
    }
  }, [watchBet]);

  return (
    <Dialog open={!!choice?.toString()} onClose={() => onClose?.()} className={className}>
      <div className="p-4 md:p-10 min-w-[min(500px,80vw)] ">
        <div className="mb-4">
          <h1 className="text-xl">{data.title}</h1>
          <h2>Bet for {data.choices?.[choice as any]?.choiceName}</h2>
        </div>
        {data.winner === 0 && (
          <form onSubmit={handleSubmit(data => onBet(data.bet))}>
            <div className="text-sm text-gray-500 mb-1">Bet amount</div>
            <Controller
              control={control}
              name="bet"
              defaultValue={0}
              render={({ field: { value, onChange } }) => (
                <NumberInput
                  className="mb-2"
                  value={value}
                  min={1}
                  step={1}
                  max={maxAmount}
                  error={errors.bet?.message}
                  onChange={e => onChange(Math.floor(+e.target.value))}
                />
              )}
            />
            <EventBetMultiplier
              event={data.uuid}
              choice={choice}
              initial={Number(data.choices?.[choice]?.currentMultiplier) / 1000}
              amount={debouncedBet}
            />
            <Button disabled={isPending} variant="contained" className="w-full mt-4" type="submit">
              {isPending && <CircularProgress size={12} className="absolute" />}
              Bet
            </Button>
          </form>
        )}
        <EventBetList event={data} choice={choice} />
      </div>
    </Dialog>
  );
}
