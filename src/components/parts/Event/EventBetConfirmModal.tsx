import React, { useEffect } from 'react';
import useContract from '@/hooks/useContract';
import { toast } from 'sonner';
import Modal from '@/components/misc/Modal';
import useToken from '@/hooks/useToken';

export default function EventBetConfirmModal({
  event,
  data,
  onClose,
  onConfirm,
}: {
  event: SportEvent;
  data: { choice: number; amount: number } | null;
  onClose: () => void;
  onConfirm: () => void;
} & ComponentProps) {
  const { placeBet, isPending, transactionConfirm } = useContract();
  const { token } = useToken();

  useEffect(() => {
    if (transactionConfirm) {
      onConfirm();
    }
  }, [transactionConfirm]);

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

  const choice = event.choices?.find(x => x.choiceIndex === data?.choice)?.choiceName;

  if (!data || !choice) {
    return <></>;
  }

  return (
    <Modal
      isOpen={!!data?.choice?.toString()}
      onClose={() => onClose?.()}
      onConfirm={() => onBet()}
      isLoading={isPending}
      title="Confirm your bet?"
    >
      <div className="text-gray ">
        <h2 className="mb-2">{event.title}</h2>
        <p>
          {choice}
          {choice.toLowerCase() !== 'draw' ? ' to win: ' : ': '}
          <span className="font-bold">
            {data.amount} {token}
          </span>
        </p>
      </div>
    </Modal>
  );
}
