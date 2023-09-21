import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { TableRow,TableCell } from '@mui/material';

const AdminEditOrdersTableRow = ({cart,setCart,image, itemName, quantity, price,cartTotal,setCartTotal,itemId,changedCartTotal,setChangedCartTotal}) => {

    const [totalPrice, setTotalPrice] = useState(cartTotal[itemId]);
    const [_quantity, _setQuantity] = useState(quantity);
    

    useEffect(() => {
        cartTotal[itemId] = _quantity * price;
        console.log(cartTotal);
        setCartTotal(cartTotal);
        setChangedCartTotal(!changedCartTotal);
    }, [_quantity]);

    function handleIncrease(){
        cart[itemId] = cart[itemId] + 1;
        console.log(cart);
        _setQuantity(_quantity + 1);
    }

    function handleDecrease(){
        if(_quantity > 1){
            cart[itemId] = cart[itemId] - 1;
            console.log(cart);
            _setQuantity(_quantity - 1);
        }
    }

    useEffect(() => {
        console.log('changed')

        setTotalPrice(cartTotal[itemId]);
    }, [changedCartTotal]);

  return (
    <TableRow key={itemName} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align="center" component="th" scope="row">
        <img src={image} className="w-20 h-20" />
      </TableCell>
      <TableCell align="center">
        {itemName}
      </TableCell>
      <TableCell align="center">
        <button className='p-3 bg-color60 rounded-lg' onClick={handleIncrease}>+</button>
      </TableCell>
      <TableCell align="center">

        <button className='p-3 bg-red-400 rounded-lg' onClick={handleDecrease}>-</button>
      </TableCell>
      <TableCell align="center">
        {_quantity}
      </TableCell>
      <TableCell align="center">
        {price}
      </TableCell>
      <TableCell align="center">
        {totalPrice}
      </TableCell>
    </TableRow>
  );
};

export default AdminEditOrdersTableRow;
