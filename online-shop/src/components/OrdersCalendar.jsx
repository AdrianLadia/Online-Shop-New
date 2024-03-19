import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';

const OrdersCalendar = (props) => {
  const startDate = props.startDate;
  const setStartDate = props.setStartDate;
  const disabledDates = props.disabledDates;
  const minDate = props.minDate;
  const maxDate = props.maxDate;
  const filterDate = props.filterDate;
  const width = props.width;

  return (
    <div className="rounded-md">
      <DatePicker
        className="h-12 w-full rounded-md outline-color10b border-2  indent-5 hover:border-color10b bg-slate-100
                      placeholder:text-lg placeholder:text-color10b"
        placeholderText="Delivery Date"
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        minDate={minDate}
        maxDate={maxDate}
        filterDate={filterDate}
      />
    </div>
  );
};

export default OrdersCalendar;
