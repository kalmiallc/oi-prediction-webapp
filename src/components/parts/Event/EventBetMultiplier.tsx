import React, { useEffect, useState } from 'react';
import { useConfig, useReadContract } from 'wagmi';
import { readContract } from '@wagmi/core';
import { betAbi } from '../../../lib/abi';
import { ContractType, getContractAddressForEnv } from '../../../lib/contracts';
import classNames from 'classnames';
import { formatEther, formatUnits, parseEther } from 'viem';

export default function EventBetMultiplier({
  className,
  event,
  choice,
  initial,
  amount,
}: { event: string; choice: number; initial: number; amount: number } & ComponentProps) {
  const [newMulti, setNewMulti] = useState(0);
  const [newReturn, setNewReturn] = useState(initial * amount);
  const { data: aproxReturn, refetch } = useReadContract({
    abi: betAbi,
    address: getContractAddressForEnv(ContractType.BET_SHOWCASE, process.env.NODE_ENV),
    functionName: 'calculateAproximateBetReturn',
    args: [parseEther(amount.toString()), choice, event],
  });

  async function getNewMutli() {
    refetch();
  }

  useEffect(() => {
    if (amount) {
      getNewMutli();
    } else {
      console.log(1);
      setNewMulti(initial);
      setNewReturn(0);
    }
  }, [amount]);

  useEffect(() => {
    if (aproxReturn) {
      const numberReturn = Number(formatEther(aproxReturn as bigint));
      const multiplier = numberReturn / amount;
      console.log({ numberReturn, multiplier, amount, aproxReturn });
      setNewMulti(multiplier);
      setNewReturn(Number(numberReturn));
    }
  }, [aproxReturn]);
  return (
    <div className={classNames(['text-xs text-gray items-center', className])}>
      <div className="mb-1">
        Multiplier:{' '}
        <span className="text-black font-bold">x{(newMulti || initial).toFixed(2)}</span>
      </div>
      <div>
        Potential FLR Returns:{' '}
        <span className="text-black font-bold">{(newReturn || initial * amount).toFixed(2)}</span>
      </div>
    </div>
  );
}
