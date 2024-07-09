import React, { useEffect, useState } from 'react';
import { useConfig } from 'wagmi';
import { readContract } from '@wagmi/core';
import { betAbi } from '../../../lib/abi';
import { ContractType, getContractAddressForEnv } from '../../../lib/contracts';

export default function EventBetMultiplier({
  event,
  choice,
  initial,
  amount,
}: { event: string; choice: number; initial: number; amount: number } & ComponentProps) {
  const config = useConfig();
  const [newMulti, setNewMulti] = useState(0);

  async function getNewMutli() {
    const aproxReturn = await readContract(config, {
      abi: betAbi,
      address: getContractAddressForEnv(ContractType.BET_SHOWCASE, process.env.NODE_ENV),
      functionName: 'calculateAproximateBetReturn',
      args: [amount, choice, event],
    } as any);
    console.log({ amount, choice, event });
    const numberReturn = Number(aproxReturn) / 1000;
    const multiplier = numberReturn / amount;
    console.log({ numberReturn, multiplier, aproxReturn });
    setNewMulti(multiplier);
  }

  useEffect(() => {
    getNewMutli();
  }, [amount]);
  return (
    <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-200 rounded-lg w-fit px-1 my-1">
      Multiplier: x{(newMulti || initial).toFixed(2)}
    </span>
  );
}
