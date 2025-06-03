import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const TimeDate=(props)=> {
//   const [value, setValue] = React.useState(dayjs('2022-04-17T15:30'));
  const [value, setValue] = React.useState(dayjs());

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
        {/* <DateTimePicker
          label="Fecha de Inicio"
          defaultValue={dayjs('2022-04-17T15:30')}
        /> */}
        <DateTimePicker
          label={props.title}
          value={value}
        //   onChange={(newValue) => setValue(newValue)}
          onChange={(newValue) => setValue(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

export default TimeDate;