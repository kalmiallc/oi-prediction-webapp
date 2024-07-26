import React, { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { betAbi } from '@/lib/abi';
import { ContractType, getContractAddressForNetwork } from '@/lib/contracts';
import classNames from 'classnames';
import { formatEther, parseEther } from 'viem';
import { useGlobalContext } from '@/contexts/global';

export default function EventBetMultiplier({
  className,
  event,
  choice,
  initial,
  amount,
}: { event: string; choice: number; initial: number; amount: number } & ComponentProps) {
  const {
    state: { selectedNetwork },
  } = useGlobalContext();
  const [newMulti, setNewMulti] = useState(0);
  const [newReturn, setNewReturn] = useState(initial * amount);

  const {
    data: aproxReturn,
    refetch,
    isLoading,
  } = useReadContract({
    abi: betAbi,
    address: getContractAddressForNetwork(ContractType.BET_SHOWCASE, selectedNetwork),
    functionName: 'calculateAproximateBetReturn',
    args: [parseEther(amount?.toString() || '0').toString(), choice, event],
    query: { staleTime: 1 * 60 * 1000, enabled: !!amount },
  });

  async function getNewMutli() {
    refetch();
  }

  useEffect(() => {
    if (amount) {
      getNewMutli();
    } else {
      setNewMulti(initial);
      setNewReturn(0);
    }
  }, [amount]);

  useEffect(() => {
    if (aproxReturn) {
      const numberReturn = Number(formatEther(aproxReturn as bigint));
      const multiplier = numberReturn / amount;
      setNewMulti(multiplier);
      setNewReturn(Number(numberReturn));
    }
  }, [aproxReturn]);
  return (
    <div className={classNames(['text-xs text-gray items-center', className])}>
      <div className="mb-1">
        Multiplier:{' '}
        <span className="text-black font-bold">
          x{(newMulti || isLoading ? newMulti : initial).toFixed(2)}
        </span>
      </div>
      <div>
        Potential OI Returns:{' '}
        <span className="text-black font-bold">
          {(newReturn || isLoading ? newReturn : initial * amount).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
