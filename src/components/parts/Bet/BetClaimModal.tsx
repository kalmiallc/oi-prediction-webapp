import React, { useEffect } from 'react';
import useContract from '@/hooks/useContract';
import { toast } from 'sonner';
import Modal from '@/components/misc/Modal';
import { formatUnits } from 'viem';

export default function BetClaimModal({
  event,
  bet,
  open,
  onClose,
  onClaim,
}: {
  open: boolean;
  event: SportEvent;
  bet: Bet;
  onClose: () => void;
  onClaim?: () => void;
} & ComponentProps) {
  const { claimBet, isPending, transactionConfirm } = useContract();

  async function onConfirm() {
    try {
      if (!bet?.id) {
        return;
      }
      await claimBet(bet.id);
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
      onClaim?.();
    }
  }, [transactionConfirm]);

  const choice = event?.choices[bet.betChoice];
  return (
    <Modal
      isOpen={open}
      onClose={() => onClose()}
      onConfirm={() => onConfirm()}
      isLoading={isPending}
      title="Claim your winnings?"
    >
      <div className="text-gray ">
        <h2 className="mb-2">{event.title}</h2>
        <p>
          {choice.choiceName}
          {choice.choiceName.toLowerCase() !== 'draw' ? ' to win' : ''}
        </p>
        <p>
          Winnings:{' '}
          <span className="font-bold">
            {((Number(bet.winMultiplier) / 1000) * +formatUnits(bet.betAmount, 18)).toFixed(4)} SGB
          </span>
        </p>
      </div>
    </Modal>
  );
}
