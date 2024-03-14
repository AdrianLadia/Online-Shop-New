import React from 'react';
import { Button, TextField, Typography } from '@material-ui/core';
import { useState } from 'react';

const AdminCustomerAccountEditPrice = ({ item, price }) => {
  const [_price, _setPrice] = useState(price);
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
      <Button variant="contained" color="primary">
        Save
      </Button>
    </div>
  );
};

export default AdminCustomerAccountEditPrice;
