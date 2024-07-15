import { useReadContract } from 'wagmi';
import { betAbi } from '@/lib/abi';
import { ContractType, getContractAddressForEnv } from '@/lib/contracts';
import { Sports, sportByLink, sportsNames } from '@/lib/values';
import { useEffect, useState } from 'react';
import EventCard from '@/components/parts/Event/EventCard';
import { useGlobalContext } from '@/contexts/global';
import { useParams } from 'next/navigation';
import { CircularProgress, TextField } from '@mui/material';
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';
import useDebounce from '@/hooks/useDebounce';
import DatePicker from '@/components/inputs/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

export default function SportPage() {
  const params = useParams<{ sport: string }>();
  const { state, dispatch } = useGlobalContext();

  const [sport, setSport] = useState<Sports | undefined>(sportByLink?.[params?.sport] || undefined);

  const [sportEvents, setSportEvents] = useState([] as SportEvent[]);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState<Dayjs | null>(
    state.timestamp ? dayjs(state.timestamp * 1000) : dayjs()
  );
  const { debounce } = useDebounce();

  const { data, refetch, isLoading } = useReadContract({
    abi: betAbi,
    address: getContractAddressForEnv(ContractType.BET_SHOWCASE, process.env.NODE_ENV),
    functionName: 'getSportEventsByDateAndSport',
    args: [state.timestamp, sport],
  });

  function getMappedEvents() {
    return (data as SportEvent[]).map((x: SportEvent) => ({
      ...x,
      choices: x.choices.map((c, i) => ({ ...c, choiceIndex: i })),
    }));
  }

  useEffect(() => {
    if (params?.sport) {
      setSport(sportByLink?.[params.sport]);
    }
  }, [params]);

  useEffect(() => {
    if (data) {
      debounce(
        () =>
          setSportEvents(
            getMappedEvents().filter(x => x.title.toLowerCase().includes(search.toLowerCase()))
          ),
        500
      );
    }
  }, [search, data]);

  useEffect(() => {
    if (date && sport != null) {
      const timestamp = date.endOf('d').unix();
      const startOfDay = Math.floor(timestamp - (timestamp % 86400));
      dispatch({ type: 'setTimestamp', payload: startOfDay });
      refetch();
    }
  }, [date, sport]);

  useEffect(() => {
    if (Array.isArray(data) && data?.length) {
      setSportEvents(getMappedEvents());
    } else {
      setSportEvents([]);
    }
  }, [data]);

  return (
    <div className="md:px-24 md:max-w-[1200px] m-auto">
      {sport != null && (
        <>
          <div className="flex md:flex-nowrap flex-wrap justify-between mb-8 items-center gap-4">
            <h1 className="text-black text-[32px] font-bold shrink-0">{sportsNames[sport]}</h1>
            <div className="flex gap-4 md:justify-end justify-between w-full">
              <TextField
                className="max-w-[250px]"
                value={search}
                size="small"
                InputProps={{ endAdornment: <Icon path={mdiMagnify} size={1} /> }}
                onChange={e => setSearch(e.target.value)}
              />
              <DatePicker value={date} className="max-w-[150px]" onChange={e => setDate(e)} />
            </div>
          </div>
          <div className="flex flex-col gap-10 items-center">
            {!!sportEvents?.length ? (
              sportEvents.map((event, i) => <EventCard event={event} key={i} />)
            ) : isLoading ? (
              <CircularProgress size={40} className="" />
            ) : (
              <div>No events on this date</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
