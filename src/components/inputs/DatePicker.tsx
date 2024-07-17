import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import classNames from 'classnames';
import { Dayjs } from 'dayjs';

export default function DatePicker({
  className,
  value,
  onChange,
  clearable = false,
}: { clearable?: boolean; value?: any; onChange: (e: Dayjs | null) => void } & ComponentProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDatePicker
        value={value}
        className={classNames([className])}
        label="Date"
        slotProps={{
          textField: { size: 'small' },
          field: { clearable: clearable },
        }}
        onChange={x => onChange?.(x)}
      />
    </LocalizationProvider>
  );
}
