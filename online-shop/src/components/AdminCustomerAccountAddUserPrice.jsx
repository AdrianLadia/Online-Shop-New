import React, { useEffect } from 'react';
import { Button, TextField, Typography } from '@material-ui/core';
import { useState, useContext } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import AppContext from '../AppContext';

const AdminCustomerAccountAddUserPrice = ({ products, selectedCustomer,setUserPrices }) => {
  const {firestore,alertSnackbar} = useContext(AppContext);
  const [_price, _setPrice] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const _filiteredProducts = products.filter((option) => {
    if (option.unit != 'Pack') {
      return option;
    }
  });
  useEffect(() => {
    
  }, [selectedProduct]);

  async function updateUserPrice() {
    const itemId = selectedProduct.itemId;
    const itemName = selectedProduct.itemName;
    const price = _price;
    console.log(itemId);
    console.log(itemName);
    console.log(price);
    console.log(selectedCustomer.uid);
    await firestore.editUserPrice(selectedCustomer.uid, itemId, price);
    alertSnackbar('success', 'New Price Added Successfully');
    setUserPrices((prev) => {
      return {
        ...prev,
        [itemId]: price,
      };
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={_filiteredProducts.map((option) => (option))}
          getOptionLabel={(option) => option.itemName}
          sx={{ width: 300 }}
          onChange={(e, value) => {
            setSelectedProduct(value);
          }}
          renderInput={(params) => <TextField {...params} label="Item Name" />}
        />
      </div>
      <div className="flex flex-row justify-between">
        <TextField
          id="outlined-number"
          label="Price"
          type="number"
          value={_price}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => {
            _setPrice(e.target.value);
          }}
        />
        <button onClick={()=>{
            updateUserPrice();
        }} className='p-3 bg-color10b rounded-lg text-white'>
          Save
        </button>
      </div>
    </div>
  );
};

export default AdminCustomerAccountAddUserPrice;
