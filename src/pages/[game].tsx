import { useRouter } from 'next/router';
import { useReadContract } from 'wagmi';
import { betAbi } from '../lib/abi';
import { ContractType, getContractAddressForEnv } from '../lib/contracts';
import { sportByLink } from '../lib/values';
import { useEffect, useState } from 'react';
import EventCard from '../components/parts/Event/EventCard';

export default function Home() {
  const router = useRouter();

  const [gameData, setGameData] = useState([] as GameData[]);

  const gameLink = router?.query?.game as string;
  const game = sportByLink?.[gameLink];
  const dateTimestamp = new Date('2024-07-02').getTime() / 1000;
  const startOfDay = Math.floor(dateTimestamp - (dateTimestamp % 86400));

  const { data } = useReadContract({
    abi: betAbi,
    address: getContractAddressForEnv(ContractType.BET_SHOWCASE, process.env.NODE_ENV),
    functionName: 'getSportEventsByDateAndSport',
    args: [startOfDay, game],
  });

  useEffect(() => {
    if (Array.isArray(data) && data?.length) {
      setGameData(data as GameData[]);
    } else {
      setGameData([]);
    }
  }, [data]);

  return (
    <div className="p-24">
      <h1 className="text-black text-3xl font-bold mb-8">{game}</h1>
      <div className="flex flex-col gap-4">
        {!!gameData?.length && gameData.map(data => <EventCard data={data} />)}
      </div>
    </div>
  );
}
