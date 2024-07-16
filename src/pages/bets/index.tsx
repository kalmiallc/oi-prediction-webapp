import { useEffect, useState } from 'react';
import DatePicker from '@/components/inputs/DatePicker';
import BetList from '@/components/parts/Bet/BetList';
import dayjs, { Dayjs } from 'dayjs';
import { useGlobalContext } from '@/contexts/global';

export default function BetsPage() {
  const { dispatch, state } = useGlobalContext();
  const [date, setDate] = useState<Dayjs | null>(
    state.timestamp ? dayjs(state.timestamp * 1000) : dayjs()
  );

  useEffect(() => {
    if (date) {
      const timestamp = date.endOf('d').unix();
      const startOfDay = Math.floor(timestamp - (timestamp % 86400));
      dispatch({ type: 'setTimestamp', payload: startOfDay });
    }
  }, [date]);

  return (
    <div className="md:px-24 md:max-w-[1200px] m-auto">
      <div className="flex md:flex-nowrap flex-wrap justify-between mb-8 items-center gap-4">
        <h1 className="text-black text-[32px] font-bold shrink-0">My bets</h1>
        <DatePicker value={date} className="max-w-[150px]" onChange={e => setDate(e)} />
      </div>
      <BetList />
    </div>
  );
}
