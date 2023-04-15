import React from 'react';
import AppContext from '../AppContext';
import { useEffect, useContext, useState } from 'react';
import { Typography } from '@mui/material';
import MyOrderCard from './MyOrderCard';

function MyOrders() {
  const { orders } = useContext(AppContext);

  const [reversedOrders, setReversedOrders] = useState([]);

  useEffect(() => {
    setReversedOrders([...orders].reverse());
  }, [orders]);

  return (
    <React.Fragment>
      <div className="flex justify-center bg-gradient-to-r from-colorbackground via-color2 to-color1">
        <Typography variant="h2">My Orders</Typography>
      </div>
      {reversedOrders.map((order) => {
        return <MyOrderCard key={order.reference} order={order} />;
      })}
    </React.Fragment>
  );
}

export default MyOrders;
