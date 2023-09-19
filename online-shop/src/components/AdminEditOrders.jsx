import React from 'react';
import { useState, useEffect, useContext } from 'react';
import menuRules from '../../utils/classes/menuRules';
import AppContext from '../AppContext';
import { Typography, TextField } from '@mui/material';

const AdminEditOrders = () => {
  const { userdata,firestore } = useContext(AppContext);
  const rules = new menuRules(userdata.userRole);
  const [orderReference, setOrderReference] = useState('');
  const [cart, setCart] = useState({});
  const [cartItemPrice, setCartItemPrice] = useState({});

  async function searchOrder() {
    console.log('searchOrder');
    const orderDetails = await firestore.readSelectedOrder(orderReference)
    console.log(orderDetails);
    setCart(orderDetails.cart);
    setCartItemPrice(orderDetails.cartItemPrice);
  }

  return (
    <div>
      {rules.checkIfUserAuthorized('editCustomerOrders') ? (
        <div className="flex flex-col">
          <div className="flex w-full items-center justify-center mt-10">
            <Typography variant="h4">Edit Orders</Typography>
          </div>
          <div className="flex flex-col w-full items-center justify-center mt-10">
            <TextField
              required
              id="outlined-basic"
              label="Order Reference"
              variant="outlined"
              sx={{ width: '90%', marginTop: 1 }}
              onChange={(event) => setOrderReference(event.target.value)}
            />
            <button className="bg-color10b text-white rounded-lg p-3 mt-5" onClick={searchOrder}>
              Search
            </button>
          </div>
        </div>
      ) : (
        'UNAUTHORIZED'
      )}
    </div>
  );
};

export default AdminEditOrders;
