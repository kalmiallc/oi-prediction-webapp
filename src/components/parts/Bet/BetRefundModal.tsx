import React, { useEffect } from 'react';
import useContract from '@/hooks/useContract';
import { toast } from 'sonner';
import Modal from '@/components/misc/Modal';
import { formatUnits } from 'viem';
import useToken from '@/hooks/useToken';

export default function BetRefundModal({
  event,
  bet,
  open,
  onClose,
  onRefund,
}: {
  open: boolean;
  event: SportEvent;
  bet: Bet;
  onClose: () => void;
  onRefund?: () => void;
} & ComponentProps) {
  const { refundBet, isPending, transactionConfirm } = useContract();
  const { token } = useToken();

  async function onConfirm() {
    try {
      if (!bet?.id) {
        return;
      }
      await refundBet(bet.id);
      onClose();
      toast.success('Bet winnings claimed');
    } catch (error: any) {
      if (error?.shortMessage) {
        toast.error(error?.shortMessage);
      }
      console.log(error);
    }
  }

  useEffect(() => {
    if (transactionConfirm) {
      onRefund?.();
    }
  }, [transactionConfirm]);

  const choice = event?.choices[bet.betChoice];
  return (
    <Modal
      isOpen={open}
      onClose={() => onClose()}
      onConfirm={() => onConfirm()}
      isLoading={isPending}
      title="Refund your bet?"
    >
      <div className="text-gray">
        <h2 className="mb-2 text-xl">{event.title}</h2>
        <p>
          {choice.choiceName}
          {choice.choiceName.toLowerCase() !== 'draw' ? ' to win' : ''}
        </p>
        <p>
          Amount:{' '}
          <span className="font-bold">
            {(+formatUnits(bet.betAmount, 18)).toFixed(4)} {token}
          </span>
        </p>
      </div>
    </Modal>
  );
}
