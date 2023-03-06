import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AppContext from "../AppContext";
import { useContext } from "react";
import firestoredb from "./firestoredb";
import { Typography } from "@mui/material";


const CheckoutSummary = (props) => {
  function createData(itemimage, itemname, itemquantity, itemprice, itemtotal,weighttotal) {
    return { itemimage, itemname, itemquantity, itemprice, itemtotal,weighttotal };
  }

  const [
    userdata,
    setUserData,
    isadmin,
    db,
    cart,
    setCart,
    favoriteitems,
    setFavoriteItems,
    userId,
    setUserId,
    refreshUser,
    setRefreshUser,
    userLoaded,
    setUserLoaded,
    deliveryaddress,
    setDeliveryAddress,
  ] = useContext(AppContext);

  let [rows, setRows] = React.useState([]);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [finalCartData, setFinalCartData] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const firestore = new firestoredb();
  const [loading, setLoading] = React.useState(true);

  const total = props.total;
  const setTotal = props.setTotal;
  const deliveryFee = props.deliveryFee
  const grandtotal = props.grandtotal;
  const vat = props.vat;
  const setTotalWeight = props.setTotalWeight;
  const totalWeight = props.totalWeight;
  const deliveryVehicle = props.deliveryVehicle;
  const area = props.area


  // useEffect(() => {
  //   setRows([])
  // }, []);

  useEffect(() => {
    firestore.readAllProducts().then((product_list) => {
      const items = [...new Set(cart)];
      let item_count = {};
      items.map((item, index) => {
        item_count[item] = 0;
      });

      cart.map((item, index) => {
        item_count[item] += 1;
      });

      let rows_non_state = [];
      let total_non_state = 0;
      let total_weight_non_state = 0;

      try {

        Object.entries(item_count).map(([key, quantity]) => {
          product_list.map((product) => {
            if (product.itemid === key) {
              total_weight_non_state += product.weight * quantity;
              total_non_state += product.price * quantity;
    
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

      } catch (error) {
        console.log(error);
      }

      setLoading(false);
      setTotal(total_non_state);
      setTotalWeight(total_weight_non_state);

    });
  }, [cart]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                    <TableCell align="right">{row.weighttotal + ' Kg'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="flex flex-col lg:flex-row w-full">
            <div className="flex w-full flex-col mt-5 ml-5 items-start">
              {area.includes('lalamoveServiceArea') ? 
              <div>
                <Typography variant="h5">Delivery Vehicle : {deliveryVehicle[0]}</Typography>
                <Typography variant="h5"> Max Weight : {deliveryVehicle[1]} Kg</Typography>
              </div>
              : null}
              <Typography variant="h5">Weight of Items: {totalWeight} Kg</Typography>

            </div>
            <div className="flex w-full flex-col ml-5 items-start lg:mt-5 md:mt-5 md:mr-3 lg:mr-3 lg:items-end md:items-end">
              <Typography variant="h5">
                Items Total: ₱ {total.toLocaleString()}
              </Typography>
              <Typography variant="h5" className="ml-5">
                Tax: ₱ {vat.toLocaleString()}
              </Typography>
              {area.includes('lalamoveServiceArea') ? 
              <Typography variant="h5">
                Delivery Fee: ₱ {deliveryFee.toLocaleString()}
              </Typography>
              :
              <div className="flex flex-col text-right">
                <Typography variant="h5">
                  Cebu Port Fees: ₱ {deliveryFee.toLocaleString()}
                </Typography>
                <Typography variant="h5">
                  Shipping Fee: Freight Collect
                </Typography>
              </div>
              }
            
              <Typography variant="h5">
                Grand Total: ₱ {grandtotal.toLocaleString()}
              </Typography>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CheckoutSummary;
