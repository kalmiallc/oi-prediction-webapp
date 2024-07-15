import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import NumberInput from '@/components/inputs/NumberInput';
import useFormSchema from '@/hooks/useFormSchema';
import { Controller } from 'react-hook-form';
import EventBetMultiplier from './EventBetMultiplier';
import useDebounce from '@/hooks/useDebounce';

export default function EventBetInput({
  event,
  choice,
  onBet,
}: { event: SportEvent; choice: Choice; onBet: (amount: number) => void } & ComponentProps) {
  const { debounce } = useDebounce();

  const [debouncedBet, setDebouncedBet] = useState(0);
  const maxAmount = Number(event.poolAmount);

  const schema = z.object({
    bet: z.number().min(0.01, 'Invalid amount').max(maxAmount, 'Invalid amount'),
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

  const choiceName =
    choice.choiceIndex && choice.choiceIndex > 1
      ? choice.choiceName
      : choice.choiceName + ' to win';

  return (
    <div className="flex flex-col  w-full max-w-[220px]">
      <form onSubmit={handleSubmit(data => onBet(data.bet))} className="">
        <div className="text-gray text-sm mb-2">{choiceName}</div>
        <div className="flex min-w-[150px] border-primary rounded-lg bg-primary">
          <Controller
            control={control}
            name="bet"
            defaultValue={0}
            render={({ field: { value, onChange } }) => (
              <NumberInput
                value={value}
                min={0}
                step={0.1}
                max={maxAmount}
                className="!ring-primary flex-grow"
                onChange={e => onChange(Math.max(Number(e.target.value), 0))}
              ></NumberInput>
            )}
          />
          <button className="bg-primary text-white px-4 rounded-r-lg w-[60px]">Bet</button>
        </div>
        {!!errors.bet?.message && (
          <div className="text-red text-xs mt-1">{errors.bet?.message}</div>
        )}
      </form>
      <EventBetMultiplier
        className="mt-3"
        event={event.uid}
        choice={choice.choiceIndex as number}
        initial={Number(choice?.currentMultiplier) / 1000}
        amount={debouncedBet}
      />
    </div>
  );
}
