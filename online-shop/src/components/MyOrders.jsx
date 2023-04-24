import React from 'react';
import AppContext from '../AppContext';
import { useEffect, useContext, useState } from 'react';
import { Typography } from '@mui/material';
import MyOrderCard from './MyOrderCard';
import {BsFillBagCheckFill } from "react-icons/bs";

function MyOrders() {
  const { orders } = useContext(AppContext);

  const [reversedOrders, setReversedOrders] = useState([]);

  useEffect(() => {
    setReversedOrders([...orders].reverse());
  }, [orders]);

  return (
    <React.Fragment>
      <div className="flex flex-col justify-center bg-gradient-to-r from-colorbackground via-color2 to-color1">
        <div className="flex md:flex-row flex-row-reverse justify-center my-10 md:-ml-14">
         <Typography className='self-center' variant="h2">My Orders </Typography>
         <BsFillBagCheckFill/>
        </div>
      {reversedOrders.map((order) => {
        return <MyOrderCard key={order.reference} order={order} />;
      })} 
      </div>
    </React.Fragment>
  );
}

export default MyOrders;
