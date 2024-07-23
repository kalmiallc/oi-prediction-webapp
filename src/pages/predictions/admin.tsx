import { useEffect, useState } from 'react';
import DatePicker from '@/components/inputs/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useGlobalContext } from '@/contexts/global';
import AdminBetList from '../../components/parts/Bet/Admin/AdminBetList';

export default function AdminBetsPage() {
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
    <div className="md:px-10 lg:px-14 xl:px-24 md:max-w-[1400px] m-auto">
      <div className="flex md:flex-nowrap flex-wrap justify-between mb-8 items-center gap-4">
        <h1 className="typo-h1 shrink-0">All bets</h1>
        <DatePicker
          label="Event Date"
          value={date}
          className="max-w-[150px]"
          onChange={e => setDate(e)}
        />
      </div>
      <AdminBetList />
    </div>
  );
}
