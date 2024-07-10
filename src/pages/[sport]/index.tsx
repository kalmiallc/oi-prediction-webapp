import { useReadContract } from 'wagmi';
import { betAbi } from '@/lib/abi';
import { ContractType, getContractAddressForEnv } from '@/lib/contracts';
import { sportByLink } from '@/lib/values';
import { useEffect, useState } from 'react';
import EventCard from '@/components/parts/Event/EventCard';
import { useGlobalContext } from '@/contexts/global';
import { useParams } from 'next/navigation';
import { TextField } from '@mui/material';
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';
import useDebounce from '../../hooks/useDebounce';

export default function SportPage() {
  const params = useParams<{ sport: string }>();

  const [sport, setSport] = useState('');

  const [sportEvents, setSportEvents] = useState([] as SportEvent[]);
  const [search, setSearch] = useState('');
  const { state } = useGlobalContext();
  const { debounce } = useDebounce();

  const { data } = useReadContract({
    abi: betAbi,
    address: getContractAddressForEnv(ContractType.BET_SHOWCASE, process.env.NODE_ENV),
    functionName: 'getSportEventsByDateAndSport',
    args: [state.timestamp, sport],
  }) as { data: SportEvent[] };

  useEffect(() => {
    if (params?.sport) {
      setSport(sportByLink?.[params.sport]);
    }
  }, [params]);

  useEffect(() => {
    if (search) {
      debounce(
        () =>
          setSportEvents(data.filter(x => x.title.toLowerCase().includes(search.toLowerCase()))),
        500
      );
    }
  }, [search, data]);

  useEffect(() => {
    if (Array.isArray(data) && data?.length) {
      setSportEvents(data);
    } else {
      setSportEvents([]);
    }
  }, [data]);

  return (
    <div className="md:p-24 md:max-w-[900px] m-auto">
      <div className="flex justify-between mb-8 items-center">
        <h1 className="text-black text-3xl font-bold ">{sport}</h1>
        <div>
          <TextField
            value={search}
            size="small"
            InputProps={{ endAdornment: <Icon path={mdiMagnify} size={1} /> }}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 items-center">
        {!!sportEvents?.length &&
          sportEvents.map(event => <EventCard data={event} key={event.uuid} />)}
      </div>
    </div>
  );
}
