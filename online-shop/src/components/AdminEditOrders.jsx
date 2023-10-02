import React from 'react';
import { useState, useEffect, useContext } from 'react';
import menuRules from '../../utils/classes/menuRules';
import AppContext from '../AppContext';
import { Typography, TextField } from '@mui/material';
import AdminEditOrdersTable from './AdminEditOrdersTable';
import { set } from 'date-fns';

const AdminEditOrders = () => {
  const { userdata, firestore,cloudfirestore } = useContext(AppContext);
  const rules = new menuRules(userdata.userRole);
  const [orderReference, setOrderReference] = useState('');
  const [cart, setCart] = useState(null);
  const [cartItemPrice, setCartItemPrice] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(null);
  const [oldItemsTotal, setOldItemsTotal] = useState(null);
  const [newTotal, setNewTotal] = useState(null);
  const [cartTotal, setCartTotal] = useState({});
  const [changedCartTotal, setChangedCartTotal] = useState(false);
  const [rowData, setRowData] = useState([]);

  async function searchOrder() {

    const orderDetails = await firestore.readSelectedOrder(orderReference);

    setCart(orderDetails.cart);
    setDeliveryFee(orderDetails.shippingTotal);
    setCartItemPrice(orderDetails.cartItemsPrice);
    setOldItemsTotal(orderDetails.itemsTotal + orderDetails.vat);
  }

  useEffect(() => {
    if (cart) {
      const total = {};
      Object.keys(cart).forEach((itemId) => {
        total[itemId] = cart[itemId] * cartItemPrice[itemId];
      });
      setCartTotal(total);
    }
  }, [cart]);

  useEffect(() => {
    let totalPrice = 0;
    Object.keys(cartTotal).forEach((itemId) => {
      totalPrice += cartTotal[itemId];
    });
    setNewTotal(totalPrice);
  }, [changedCartTotal]);

  async function onUpdateOrderClick() {
    try {
      await cloudfirestore.editCustomerOrder({orderReference:orderReference,cart:cart});
      alert('Order Updated');
      setRowData([]);
      setCart(null);
      setCartItemPrice(null);
      setDeliveryFee(null);
      setOldItemsTotal(null);
      setNewTotal(null);
      setCartTotal({});
      // window.location.reload();
    }
    catch (error) {
      alert(error.message);
    }
  }

  return (
    <div>
      {rules.checkIfUserAuthorized('editCustomerOrders') ? (
        <div className="flex flex-col justify-center">
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

          <div className="flex justify-center">
            <AdminEditOrdersTable
              rowData={rowData}
              setRowData={setRowData}
              changedCartTotal={changedCartTotal}
              setChangedCartTotal={setChangedCartTotal}
              cartTotal={cartTotal}
              setCartTotal={setCartTotal}
              setNewTotal={setNewTotal}
              
              cart={cart}
              setCart={setCart}
              cartItemPrice={cartItemPrice}
              deliveryFee={deliveryFee}
            />
          </div>

          <div className="flex flex-col mr-32 items-end justify-center mt-10">
            <div className="flex ">Old Total : {oldItemsTotal}</div>
            <div className="flex">New Total : {newTotal}</div>
            <div className="flex">Amount Changed : {newTotal - oldItemsTotal}</div>
            {/* <div className='flex'>
                Delivery Fee : {deliveryFee}
              </div> */}
          </div>
          <div className='justify-center flex pb-32'>
            <button onClick={onUpdateOrderClick} className="bg-color10b p-3 text-white rounded-lg "> Update Order</button>
          </div>
        </div>
      ) : (
        'UNAUTHORIZED'
      )}
    </div>
  );
};

export default AdminEditOrders;
