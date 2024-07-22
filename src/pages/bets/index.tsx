import { useEffect, useState } from 'react';
import DatePicker from '@/components/inputs/DatePicker';
import BetList from '@/components/parts/Bet/BetList';
import { Dayjs } from 'dayjs';

export default function BetsPage() {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [timestamp, setTimestamp] = useState<number | null>(null);

  useEffect(() => {
    if (date) {
      const timestamp = date.endOf('d').unix();
      const startOfDay = Math.floor(timestamp - (timestamp % 86400));
      setTimestamp(startOfDay);
    } else {
      setTimestamp(null);
    }
  }, [date]);

  return (
    <div className="md:px-24 md:max-w-[1400px] m-auto">
      <div className="flex md:flex-nowrap flex-wrap justify-between mb-8 items-center gap-4">
        <h1 className="typo-h1 shrink-0">My bets</h1>
        <DatePicker
          label="Event Date"
          clearable={true}
          value={date}
          className="max-w-[180px]"
          onChange={e => setDate(e)}
        />
      </div>
      <BetList timestamp={timestamp} />
    </div>
  );
}
