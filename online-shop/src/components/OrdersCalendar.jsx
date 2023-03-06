import React from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

const OrdersCalendar = (props) => {

    
    const startDate = props.startDate
    const setStartDate = props.setStartDate



  return (
    <div className='border-2 border-black'>
       <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
    </div>
  )
}

export default OrdersCalendar
