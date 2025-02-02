import { useReadContract } from 'wagmi';
import { betAbi } from '@/lib/abi';
import { ContractType, getContractAddressForNetwork } from '@/lib/contracts';
import { Sports, sportByLink, sportsNames } from '@/lib/values';
import { useEffect, useState } from 'react';
import EventCard from '@/components/parts/Event/EventCard';
import { useParams } from 'next/navigation';
import { CircularProgress, TextField } from '@mui/material';
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';
import useDebounce from '@/hooks/useDebounce';
import DatePicker from '@/components/inputs/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useGlobalContext } from '@/contexts/global';

export default function SportPage() {
  const params = useParams<{ sport: string }>();
  const {
    eventEmitter,
    state: { selectedNetwork },
  } = useGlobalContext();

  const [sport, setSport] = useState<Sports | undefined>(sportByLink?.[params?.sport] || undefined);

  const [sportEvents, setSportEvents] = useState([] as SportEvent[]);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState<Dayjs | null>(null);
  const [timestamp, setTimestamp] = useState<number | null>(null);
  const { debounce } = useDebounce();
  const [loading, setLoading] = useState(false);

  // const filteredEvents = useMemo(() => {
  //   return sportEvents.filter(
  //     x =>
  //       (!timestamp || Number(x.startTime) >= timestamp) &&
  //       x.title.toLowerCase().includes(search.toLowerCase())
  //   );
  // }, [sportEvents, timestamp, search]);

  const { data, isLoading, refetch } = useReadContract({
    abi: betAbi,
    address: getContractAddressForNetwork(ContractType.BET_SHOWCASE, selectedNetwork),
    functionName: 'getSportEventsBySport',
    args: [sport],
    query: { staleTime: 1 * 60 * 1000 },
  });

  function getSod(time: number) {
    const timestamp = dayjs(time * 1000)
      .endOf('d')
      .unix();
    return Math.floor(timestamp - (timestamp % 86400));
  }
  function getMappedEvents() {
    return (data as SportEvent[])?.length
      ? (data as SportEvent[])
          .map((x: SportEvent) => ({
            ...x,
            choices: x.choices.map((c, i) => ({ ...c, choiceIndex: i })),
          }))
          .filter(
            x =>
              (!timestamp || getSod(Number(x.startTime)) === timestamp) &&
              x.title.toLowerCase().includes(search.toLowerCase())
          )
          .sort((a, b) => {
            return Number(a.startTime) - Number(b.startTime);
          })
      : [];
  }

  useEffect(() => {
    if (params?.sport) {
      setSport(sportByLink?.[params.sport]);
    }
  }, [params]);

  useEffect(() => {
    setSportEvents(getMappedEvents());
  }, [timestamp]);

  useEffect(() => {
    if (data) {
      debounce(() => setSportEvents(getMappedEvents()), 500);
    }
  }, [search, data]);

  useEffect(() => {
    if (date) {
      const timestamp = date.endOf('d').unix();
      setTimestamp(getSod(timestamp));
    } else {
      setTimestamp(null);
    }
  }, [date]);

  useEffect(() => {
    setLoading(true);
    if (Array.isArray(data) && data?.length) {
      setSportEvents(getMappedEvents());
    } else {
      setSportEvents([]);
    }
    setTimeout(() => setLoading(false), 1000);
  }, [data]);

  useEffect(() => {
    eventEmitter.on('placedBet', () => refetch());
  }, [eventEmitter]);

  return (
    <div className="md:px-24 md:max-w-[1200px] m-auto">
      {sport != null && (
        <>
          <div className="flex md:flex-nowrap flex-wrap justify-between mb-12 md:mb-8 items-center gap-4">
            <h1 className="typo-h1 shrink-0">{sportsNames[sport]}</h1>
            <div className="flex gap-4 md:justify-end justify-between w-full">
              <TextField
                className="max-w-[250px]"
                value={search}
                size="small"
                InputProps={{ endAdornment: <Icon path={mdiMagnify} size={1} /> }}
                onChange={e => setSearch(e.target.value)}
              />
              <DatePicker
                clearable
                value={date}
                label="Event Date"
                className="max-w-[180px]"
                onChange={e => setDate(e)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-14 md:gap-10 items-center">
            {!!sportEvents?.length ? (
              sportEvents.map((event, i) => <EventCard event={event} key={i} />)
            ) : isLoading || loading ? (
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
