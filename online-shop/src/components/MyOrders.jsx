import React from 'react';
import AppContext from '../AppContext';
import { useEffect, useContext, useState } from 'react';
import { Typography } from '@mui/material';
import MyOrderCard from './MyOrderCard';
import { BsFillBagCheckFill } from 'react-icons/bs';
import { Routes,Route } from 'react-router-dom';
import ChatApp from './ChatApp/src/ChatApp'

function MyOrders() {
  const { orders } = useContext(AppContext);
  const [reversedOrders, setReversedOrders] = useState([]);

  useEffect(() => {
    setReversedOrders([...orders].reverse());
  }, [orders]);

  return (
    <Routes>
      <Route
        path="orderList"
        element={
          <React.Fragment>
            <div className="flex flex-col-reverse justify-center bg-gradient-to-r mb-8 from-colorbackground via-color2 to-color1">
              {reversedOrders.map((order) => {
                return <MyOrderCard reference={order.reference} order={order} />;
              })}
              <div className="flex md:flex-row flex-row-reverse justify-center ml-3 xs:ml-0 my-10 md:-ml-14">
                <Typography className="self-center" variant="h2">
                  My Orders{' '}
                </Typography>
                <BsFillBagCheckFill />
              </div>
            </div>
          </React.Fragment>
        }
      />
      <Route
        path="orderChat"
        element={
          <div>
            <ChatApp/>
          </div>
        }
      />
    </Routes>
  );
}

export default MyOrders;
