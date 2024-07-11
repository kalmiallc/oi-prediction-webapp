import { useReadContract } from 'wagmi';
import { betAbi } from '@/lib/abi';
import { ContractType, getContractAddressForEnv } from '@/lib/contracts';
import { sportByLink } from '@/lib/values';
import { useEffect, useMemo, useState } from 'react';
import EventCard from '@/components/parts/Event/EventCard';
import { useGlobalContext } from '@/contexts/global';
import { useParams } from 'next/navigation';
import { CircularProgress, TextField } from '@mui/material';
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';
import useDebounce from '../../hooks/useDebounce';
import DatePicker from '../../components/inputs/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

export default function SportPage() {
  const params = useParams<{ sport: string }>();
  const { state, dispatch } = useGlobalContext();

  const [sport, setSport] = useState('');

  const [sportEvents, setSportEvents] = useState([] as SportEvent[]);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState<Dayjs | null>(
    state.timestamp ? dayjs(state.timestamp) : dayjs()
  );
  const { debounce } = useDebounce();

  const { data, refetch, isLoading } = useReadContract({
    abi: betAbi,
    address: getContractAddressForEnv(ContractType.BET_SHOWCASE, process.env.NODE_ENV),
    functionName: 'getSportEventsByDateAndSport',
    args: [state.timestamp, sport],
  });

  const mappedData = useMemo(
    () =>
      (data as SportEvent[])?.length
        ? (data as SportEvent[]).map((x: SportEvent) => ({
            ...x,
            choices: x.choices.map((c, i) => ({ ...c, choiceIndex: i })),
          }))
        : [],
    [data]
  );

  useEffect(() => {
    if (params?.sport) {
      setSport(sportByLink?.[params.sport]);
    }
  }, [params]);

  useEffect(() => {
    if (mappedData) {
      debounce(
        () =>
          setSportEvents(
            mappedData.filter(x => x.title.toLowerCase().includes(search.toLowerCase()))
          ),
        500
      );
    }
  }, [search, mappedData]);

  useEffect(() => {
    if (date) {
      const timestamp = date.endOf('d').unix();
      const startOfDay = Math.floor(timestamp - (timestamp % 86400));
      dispatch({ type: 'setTimestamp', payload: startOfDay });
      refetch();
    }
  }, [date]);

  useEffect(() => {
    if (Array.isArray(data) && data?.length) {
      setSportEvents(mappedData);
    } else {
      setSportEvents([]);
    }
  }, [data]);

  return (
    <div className="md:px-24 md:max-w-[1200px] m-auto">
      <div className="flex md:flex-nowrap flex-wrap justify-between mb-8 items-center gap-4">
        <h1 className="text-black text-[32px] font-bold shrink-0">{sport}</h1>
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
      <div className="flex flex-col gap-4 items-center">
        {!!sportEvents?.length ? (
          sportEvents.map(event => <EventCard event={event} key={event.uuid} />)
        ) : isLoading ? (
          <CircularProgress size={40} className="" />
        ) : (
          <div>No events on this date</div>
        )}
      </div>
    </div>
  );
}
