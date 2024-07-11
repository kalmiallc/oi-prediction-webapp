import React, { useEffect, useState } from 'react';
import { useConfig } from 'wagmi';
import { readContract } from '@wagmi/core';
import { betAbi } from '../../../lib/abi';
import { ContractType, getContractAddressForEnv } from '../../../lib/contracts';
import classNames from 'classnames';

export default function EventBetMultiplier({
  className,
  event,
  choice,
  initial,
  amount,
}: { event: string; choice: number; initial: number; amount: number } & ComponentProps) {
  const config = useConfig();
  const [newMulti, setNewMulti] = useState(0);
  const [newReturn, setNewReturn] = useState(initial * amount);

  async function getNewMutli() {
    const aproxReturn = await readContract(config, {
      abi: betAbi,
      address: getContractAddressForEnv(ContractType.BET_SHOWCASE, process.env.NODE_ENV),
      functionName: 'calculateAproximateBetReturn',
      args: [amount, choice, event],
    } as any);
    const numberReturn = Number(aproxReturn) / 1000;
    const multiplier = numberReturn / amount;
    setNewMulti(multiplier);
    setNewReturn(Number(aproxReturn) / 1000);
  }

  useEffect(() => {
    if (amount) {
      getNewMutli();
    }
  }, [amount]);
  return (
    <div className={classNames(['text-xs text-gray items-center', className])}>
      <div>
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
