import React from 'react';
import { useState, useEffect, useContext } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AppContext from '../AppContext';
import { TextField } from '@mui/material';
import { set } from 'date-fns';
import AdminEditOrdersTableRow from './AdminEditOrdersTableRow';

const AdminEditOrdersTable = ({
  rowData,
  setRowData,
  cart,
  setCart,
  cartItemPrice,
  cartTotal,
  setCartTotal,
  changedCartTotal,
  setChangedCartTotal,
}) => {
  function createData(image, itemName, quantity, price, itemId) {
    return { image, itemName, quantity, price, itemId };
  }

  const { firestore } = useContext(AppContext);

  useEffect(() => {
    async function searchOrder() {
      const itemData = [];
      const promises = Object.keys(cart).map(async (itemId) => {
        const quantity = cart[itemId];
        const price = cartItemPrice[itemId];
        return await firestore.readSelectedDataFromCollection('Products', itemId);
      });

      const result = await Promise.all(promises);

      result.forEach((item) => {

        const quantity = cart[item.itemId];
        const price = cartItemPrice[item.itemId];
        const image = item.imageLinks[0];
        const itemName = item.itemName;
        itemData.push(createData(image, itemName, quantity, price, item.itemId));
      });

      return itemData;
    }

    if (cart) {
      searchOrder().then((itemData) => {
        setRowData(itemData);
      });
    }
  }, [cart]);

  return (
    <div className="flex mt-10 w-9/10">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Item Image</TableCell>
              <TableCell align="center">Item Name</TableCell>
              <TableCell align="center">Add</TableCell>
              <TableCell align="center">Remove</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowData
              ? rowData.map((item) => {
                
                  //   const quantity = cart[itemId];
                  //   const price = cartItemPrice[itemId];
                  return (
                    <AdminEditOrdersTableRow
                      setCart={setCart}
                      cart={cart}
                      changedCartTotal={changedCartTotal}
                      setChangedCartTotal={setChangedCartTotal}
                      itemId={item.itemId}
                      cartTotal={cartTotal}
                      setCartTotal={setCartTotal}
                      image={item.image}
                      itemName={item.itemName}
                      price={item.price}
                      quantity={item.quantity}
                    />
                  );
                })
              : ''}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminEditOrdersTable;
