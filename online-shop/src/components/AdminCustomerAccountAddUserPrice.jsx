import React, { useEffect } from 'react';
import { Button, TextField, Typography } from '@material-ui/core';
import { useState, useContext } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import AppContext from '../AppContext';

const AdminCustomerAccountAddUserPrice = ({ products, userId }) => {
  const [_price, _setPrice] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const _filiteredProducts = products.filter((option) => {
    if (option.unit != 'Pack') {
      return option;
    }
  });
  useEffect(() => {
    
  }, [selectedProduct]);

  function updateUserPrice() {
    const itemId = selectedProduct.itemId;
    const itemName = selectedProduct.itemName;
    const price = _price;
    console.log(itemId);
    console.log(itemName);
    console.log(price);
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
        <Button onClick={()=>{
            updateUserPrice();
        }} variant="contained" color="primary">
          Save
        </Button>
      </div>
    </div>
  );
};

export default AdminCustomerAccountAddUserPrice;
