import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import NumberInput from '@/components/inputs/NumberInput';
import useFormSchema from '@/hooks/useFormSchema';
import { Controller } from 'react-hook-form';
import EventBetMultiplier from './EventBetMultiplier';
import useDebounce from '@/hooks/useDebounce';
import { formatEther } from 'viem';
import EventBetConfirmModal from './EventBetConfirmModal';
import { useGlobalContext } from '@/contexts/global';

export default function EventBetInput({
  event,
  choice,
}: { event: SportEvent; choice: Choice } & ComponentProps) {
  const { debounce } = useDebounce();
  const {
    state: { balance },
  } = useGlobalContext();
  const [debouncedBet, setDebouncedBet] = useState(0);
  const [betData, setBetData] = useState(null as { choice: number; amount: number } | null);
  const [resetK, setResetK] = useState(0);

  const maxAmount = Number(formatEther(event.poolAmount)) / 10;

  const schema = z.object({
    bet: z
      .number()
      .min(0.01, 'Invalid amount')
      .max(balance, 'Insufficient balance')
      .max(maxAmount, 'Amount can not go over 10% of the pool'),
  });

  function onSubmit(amount: number) {
    setBetData({ choice: choice.choiceIndex as number, amount });
  }

  function onConfirm() {
    reset({});
    // used to reset Input field
    setResetK(resetK + 1);
  }

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useFormSchema(schema);
  const watchBet = watch('bet');

  useEffect(() => {
    if (watchBet <= maxAmount) {
      debounce(() => {
        setDebouncedBet(watchBet);
      }, 2000);
    }
  }, [watchBet]);

  const choiceName =
    choice.choiceIndex && choice.choiceIndex > 1 ? 'Draw' : choice.choiceName + ' to win';

  return (
    <div className="flex flex-col w-full max-w-[220px]">
      <form onSubmit={handleSubmit(data => onSubmit(data.bet))} noValidate>
        <div className="text-gray text-sm mb-2 ">{choiceName}</div>
        <div className="flex min-w-[150px] border-primary rounded-lg bg-primary">
          <Controller
            control={control}
            name="bet"
            render={({ field: { value, onChange } }) => (
              <NumberInput
                key={resetK}
                value={value}
                step={0.1}
                className="!ring-primary flex-grow"
                onChange={e => (
                  onChange(Math.max(Number(e.target.value), 0)),
                  Number(e.target.value) !== 0 ? trigger() : {}
                )}
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
      <EventBetConfirmModal
        event={event}
        data={betData}
        onClose={() => setBetData(null)}
        onConfirm={() => onConfirm()}
      />
    </div>
  );
}
