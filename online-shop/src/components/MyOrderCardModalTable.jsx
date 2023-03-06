import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import firestoredb from "./firestoredb";
import useWindowDimensions from "./useWindowDimensions";

const MyOrderCardModalTable = (props) => {

  const {width, height} = useWindowDimensions();
  function getMaxHeightTable() {
      return height - 10000
  }
  const order = props.order;
  const firestore = new firestoredb();


  function createData(itemimage, itemname, itemquantity, itemprice, itemtotal,weighttotal) {
    return { itemimage, itemname, itemquantity, itemprice, itemtotal,weighttotal };
  }

  const [rows, setRows] = React.useState([]);

  useEffect(() => {
    console.log(order.cart);
    firestore.readAllProducts().then((product_list) => {
      const items = [...new Set(order.cart)];
      let item_count = {};
      items.map((item, index) => {
        item_count[item] = 0;
      });

      order.cart.map((item, index) => {
        item_count[item] += 1;
      });

      let rows_non_state = [];
      let total_non_state = 0;
      let total_weight_non_state = 0;

      try {
        console.log(item_count);
        Object.entries(item_count).map(([key, quantity]) => {
          product_list.map((product) => {
            if (product.itemid === key) {
              total_weight_non_state += product.weight * quantity;
              total_non_state += product.price * quantity;
              console.log(product.weight);
              let row = createData(
                product.imagelinks[0],
                product.itemname,
                quantity.toLocaleString(),
                parseInt(product.price).toLocaleString(),
                (product.price * quantity).toLocaleString(),
                total_weight_non_state
              );
              rows_non_state.push(row);
            }
          });
        });

        setRows(rows_non_state);
        console.log(rows_non_state)
      } catch (error) {
        console.log(error);
      }

    });
  }, []);

  return (
    <div>
      <TableContainer component={Paper} >
        <Table sx={{ minWidth: 650}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell> Item</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Weight</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.itemname}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <img
                    src={row.itemimage}
                    alt="item"
                    width="100px"
                    height="100px"
                  />
                </TableCell>
                <TableCell>{row.itemname}</TableCell>
                <TableCell align="right">{row.itemquantity}</TableCell>
                <TableCell align="right">{row.itemprice}</TableCell>
                <TableCell align="right">{row.itemtotal}</TableCell>
                <TableCell align="right">{row.weighttotal + " Kg"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MyOrderCardModalTable;
