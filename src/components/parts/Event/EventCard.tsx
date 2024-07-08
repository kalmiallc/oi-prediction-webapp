import Icon from '@mdi/react';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@mui/material';
import { useAccount, useWriteContract } from 'wagmi';
import { betAbi } from '../../../lib/abi';
import { ContractType, getContractAddressForEnv } from '../../../lib/contracts';
import { parseEther } from 'viem';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function EventCard({ className, data }: { data: GameData } & ComponentProps) {
  const { isConnected, address } = useAccount();

  const { writeContractAsync } = useWriteContract();

  async function onChoice(choice: 1 | 2 | 3) {
    console.log(1);
    const constractAddress = getContractAddressForEnv(
      ContractType.BET_SHOWCASE,
      process.env.NODE_ENV
    );
    if (!constractAddress) {
      console.log(2);
      return;
    }
    try {
      const amount = parseEther('1');
      await writeContractAsync({
        abi: betAbi,
        address: constractAddress,
        functionName: 'placeBet',
        args: [data.uuid, choice],
        value: amount,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={classNames([className, 'border rounded-lg p-4'])}>
      <h3 className="text-lg mb-2">{data.title}</h3>
      <div className="">Starts {dayjs(Number(data.startTime) * 1000).fromNow()}</div>
      <div className="flex justify-between">
        {data.choices.map((choice, index) => (
          <Button disabled={!isConnected} key={index} onClick={() => onChoice(choice.choiceId)}>
            {choice.choiceName}
          </Button>
        ))}
      </div>
    </div>
  );
}
