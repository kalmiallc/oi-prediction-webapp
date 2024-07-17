import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import NumberInput from '@/components/inputs/NumberInput';
import useFormSchema from '@/hooks/useFormSchema';
import { Controller } from 'react-hook-form';
import EventBetMultiplier from './EventBetMultiplier';
import useDebounce from '@/hooks/useDebounce';
import { formatEther } from 'viem';

export default function EventBetInput({
  event,
  choice,
  onBet,
}: { event: SportEvent; choice: Choice; onBet: (amount: number) => void } & ComponentProps) {
  const { debounce } = useDebounce();

  const [debouncedBet, setDebouncedBet] = useState(0);
  const maxAmount = Number(formatEther(event.poolAmount)) / 10;

  const schema = z.object({
    bet: z
      .number()
      .min(0.01, 'Invalid amount')
      .max(maxAmount, 'Amount can not go over 10% of the pool'),
  });

  const {
    control,
    handleSubmit,
    watch,
    trigger,
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
    choice.choiceIndex && choice.choiceIndex > 1 ? 'Draw' : choice.choiceName + ' to win';

  return (
    <div className="flex flex-col w-full max-w-[220px]">
      <form onSubmit={handleSubmit(data => onBet(data.bet))} noValidate>
        <div className="text-gray text-sm mb-2 ">{choiceName}</div>
        <div className="flex min-w-[150px] border-primary rounded-lg bg-primary">
          <Controller
            control={control}
            name="bet"
            defaultValue={0}
            render={({ field: { value, onChange } }) => (
              <NumberInput
                value={value}
                step={0.1}
                className="!ring-primary flex-grow"
                onChange={e => (onChange(Math.max(Number(e.target.value), 0)), trigger())}
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
