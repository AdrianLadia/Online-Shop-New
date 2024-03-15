import React, { useEffect } from 'react';
import { Button, TextField, Typography } from '@material-ui/core';
import { useState, useContext } from 'react';
import AppContext from '../AppContext';

const AdminCustomerAccountEditPrice = ({ item, price, selectedCustomer, setUserPrices }) => {
  const { firestore, alertSnackbar } = useContext(AppContext);
  const [_price, _setPrice] = useState(price);

  useEffect(() => {
    console.log('selectedCustomer', selectedCustomer);
  }, [selectedCustomer]);

  async function onSavePrice() {
    console.log('selectedCustomer', selectedCustomer);
    console.log('item', item);
    console.log('price', _price);
    await firestore.editUserPrice(selectedCustomer.uid, item, _price);
    alertSnackbar('success', 'Price Updated Successfully');
  }

  async function onDeletePrice() {
    await firestore.deleteUserPrice(selectedCustomer.uid, item);
    setUserPrices((prev) => {
      const _prev = { ...prev };
      delete _prev[item];
      return _prev;
    });
    alertSnackbar('success', 'Price Deleted Successfully');
  }
  return (
    <div className="flex flex-row gap-5 items-center">
      <TextField
        id="outlined-read-only-input"
        label="Read Only"
        defaultValue={item}
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        id="outlined-number"
        label="Number"
        type="number"
        value={_price}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) => {
          _setPrice(e.target.value);
        }}
      />

      <button
        className="p-3 bg-color10b rounded-lg text-white"
        onClick={onSavePrice}
        variant="contained"
        color="primary"
      >
        Save
      </button>
      <button
        className="p-3 bg-color10b rounded-lg text-white"
        onClick={onDeletePrice}
        variant="contained"
        color="primary"
      >
        Delete
      </button>
    </div>
  );
};

export default AdminCustomerAccountEditPrice;
