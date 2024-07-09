import { useRouter } from 'next/router';
import { useAccount, useReadContract } from 'wagmi';
import { betAbi } from '../lib/abi';
import { ContractType, getContractAddressForEnv } from '../lib/contracts';
import { sportByLink } from '../lib/values';
import { useEffect, useState } from 'react';
import EventCard from '../components/parts/Event/EventCard';
import { useGlobalContext } from '@/contexts/global';

export default function Home() {
  const router = useRouter();

  const [sportEvents, setSportEvents] = useState([] as SportEvent[]);
  const { loadBets } = useGlobalContext();
  const { address } = useAccount();

  const sportQuery = router?.query?.sport as string;
  const sport = sportByLink?.[sportQuery];
  const dateTimestamp = new Date('2024-07-02').getTime() / 1000;
  const startOfDay = Math.floor(dateTimestamp - (dateTimestamp % 86400));
  const { data } = useReadContract({
    abi: betAbi,
    address: getContractAddressForEnv(ContractType.BET_SHOWCASE, process.env.NODE_ENV),
    functionName: 'getSportEventsByDateAndSport',
    args: [startOfDay, sport],
  });

  useEffect(() => {
    if (Array.isArray(data) && data?.length) {
      setSportEvents(data as SportEvent[]);
    } else {
      setSportEvents([]);
    }
  }, [data]);

  useEffect(() => {
    if (startOfDay) {
      loadBets(startOfDay);
    }
  }, [startOfDay, address]);

  return (
    <div className="md:p-24">
      <h1 className="text-black text-3xl font-bold mb-8 text-center">{sport}</h1>
      <div className="flex flex-col gap-4 items-center">
        {!!sportEvents?.length &&
          sportEvents.map(event => <EventCard data={event} key={event.uuid} />)}
      </div>
    </div>
  );
}
