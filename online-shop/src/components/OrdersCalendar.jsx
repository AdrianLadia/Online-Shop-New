import React from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

const OrdersCalendar = (props) => {
    const startDate = props.startDate
    const setStartDate = props.setStartDate
    const disabledDates = props.disabledDates
    const minDate = props.minDate
    const maxDate = props.maxDate
    const filterDate = props.filterDate

  return (
    <div className='rounded-md'>
       <DatePicker 
          className='h-14 w-44 sm:w-56 rounded-md outline-color10b border-2 border-blue1 indent-5 hover:border-color10b bg-white 
                      placeholder:text-lg placeholder:text-blue1' 
          placeholderText="Date"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          minDate = {minDate}
          maxDate = {maxDate}
          filterDate = {filterDate}
          />
    </div>
  )
}

export default OrdersCalendar
