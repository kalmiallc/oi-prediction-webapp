import React, { useState } from 'react';
import useContract from '@/hooks/useContract';
import { toast } from 'sonner';
import Modal from '@/components/misc/Modal';

export default function EventBetConfirmModal({
  event,
  data,
  onClose,
  onConfirm,
}: {
  event: SportEvent;
  data: { choice: number; amount: number } | null;
  onClose: () => void;
  onConfirm?: () => void;
} & ComponentProps) {
  const { placeBet, isPending } = useContract();
  const [loading, setLoading] = useState(false);

  async function onBet() {
    try {
      if (!data) {
        return;
      }
      setLoading(true);
      await placeBet(event.uid, data.choice, data.amount);
      setLoading(false);
      onConfirm?.();
      onClose();
    } catch (error: any) {
      if (error?.shortMessage) {
        toast.error(error?.shortMessage);
      }
      console.log(error);
      setLoading(false);
    }
  }

  const choice = event.choices?.find(x => x.choiceIndex === data?.choice)?.choiceName;

  if (!data || !choice) {
    return <></>;
  }

  return (
    <Modal
      isOpen={!!data?.choice?.toString()}
      onClose={() => onClose?.()}
      onConfirm={() => onBet()}
      isLoading={isPending || loading}
      title="Confirm your bet?"
    >
      <div className="text-gray ">
        <h2 className="mb-2">{event.title}</h2>
        <p>
          {choice}
          {choice.toLowerCase() !== 'draw' ? ' to win: ' : ': '}
          <span className="font-bold">
            {data.amount}
            {' OI'}
          </span>
        </p>
      </div>
    </Modal>
  );
}
