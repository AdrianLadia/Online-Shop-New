import React, { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import useWindowDimensions from './useWindowDimensions';

import AppContext from '../AppContext';

const MyOrderCardModalTable = (props) => {

  const {datamanipulation,userdata } = React.useContext(AppContext);
  
  const { height } = useWindowDimensions();
  function getMaxHeightTable() {
    return height - 10000;
  }
  const order = props.order;
  const products = props.products;
  const urlOfBir2303 = order.urlOfBir2303
  const cartItemsPrice = order.cartItemsPrice;
  
  
  const [rows, setRows] = React.useState([]);
  
 



  useEffect(() => {
    async function getTableData() {
      const [rows_non_state, total_non_state, total_weight_non_state,firstOrderDiscount] = datamanipulation.getCheckoutPageTableDate(
        products,
        order.cart,
        cartItemsPrice,
        urlOfBir2303,
        order.isInvoiceNeeded,
        userdata.orders
      );



      setRows(rows_non_state);
    }

    getTableData();
  }, [products]);



  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell> Item</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Total Pieces</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Weight</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.itemName} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <img src={row.itemimage} alt="item" width="100px" height="100px" />
                </TableCell>
                <TableCell>{row.itemName}</TableCell>
                <TableCell align="right">{row.itemquantity}</TableCell>
                <TableCell align="right">{row.pieces}</TableCell>
                <TableCell align="right">{'₱' + row.itemprice}</TableCell>
                <TableCell align="right">{'₱' + row.itemtotal}</TableCell>
                <TableCell align="right">{row.weighttotal + ' Kg'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MyOrderCardModalTable;
