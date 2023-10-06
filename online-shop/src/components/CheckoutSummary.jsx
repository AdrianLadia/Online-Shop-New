import React, { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AppContext from '../AppContext';
import { useContext } from 'react';
import firestoredb from '../firestoredb';
import { Typography } from '@mui/material';
import dataManipulation from '../../utils/dataManipulation';
import Divider from '@mui/material/Divider';
import useWindowDimensions from './UseWindowDimensions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import AppConfig from '../AppConfig';

const CheckoutSummary = (props) => {
  const { firestore, cart, products } = useContext(AppContext);

  const [loading, setLoading] = React.useState(true);
  const { width } = useWindowDimensions();

  const total = props.total;
  const deliveryFee = props.deliveryFee;
  const grandTotal = props.grandTotal;
  const vat = props.vat;
  const totalWeight = props.totalWeight;

  let deliveryVehicle;
  let maxWeight;
  if (props.deliveryVehicleObject == null) {
    deliveryVehicle = null;
    maxWeight = null;
  } else {
    deliveryVehicle = props.deliveryVehicleObject.name;
    maxWeight = props.deliveryVehicleObject.maxWeight;
  }

  const area = props.area;
  const rows = props.rows;
  
  const itemsTotal = vat + total


  function responsiveWidth() {
    if (width < 550) {
      return '90%';
    }
    if (width < 750) {
      return '75%';
    }
    if (width < 1000) {
      return '78%';
    }
    if (width < 1200) {
      return '70%';
    }
    if (width < 1400) {
      return '60%';
    }
    if (width < 1600) {
      return '50%';
    }
    if (width < 1800) {
      return '45%';
    } else {
      return '40%';
    }
  }

  return (
    <div>
      {rows == null ? (
        <div className="flex justify-center mt-7">
          <Typography variant="h6" gutterBottom component="div" color="red" className="font-bold">
            YOU NEED ITEMS IN YOUR CART
          </Typography>
        </div>
      ) : (
        <div className="flex flex-col align-center items-center gap-4 justify-center">
          <TableContainer component={Paper} elevation={10} className="flex align-center w-11/12 m-2 mb-4">
            <Table sx={{ minWidth: 650 }} className=" font-bold border-2 border-color60" aria-label="simple table">
              <TableHead>
                <TableRow className="bg-color10c">
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
                    <TableCell align="right">₱ {row.itemprice}</TableCell>
                    <TableCell align="right">₱ {row.itemtotal}</TableCell>
                    <TableCell align="right">{row.weighttotal.toFixed(2) + ' Kg'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <List
            sx={{
              width: responsiveWidth(),
              bgcolor: 'background.paper',
              marginLeft: -2,
              borderRadius: '8px',
              border: 1,
              borderColor: '#99A98F',
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-6 justify-start items-start gap-5 xs:gap-10 ">
              {deliveryVehicle && deliveryVehicle != 'storePickUp' ? (
                <ListItem>
                  <ListItemText primary="Delivery Vehicle:" secondary={deliveryVehicle} />
                </ListItem>
              ) : null}
              {maxWeight && deliveryVehicle != 'storePickUp' ? (
                <ListItem>
                  <ListItemText primary="Max Weight:" secondary={maxWeight + ' Kg'} />
                </ListItem>
              ) : null}

              {totalWeight ? (
                <ListItem>
                  <ListItemText primary="Weight of Items:" secondary={totalWeight.toFixed(2) + ' Kg'} />
                </ListItem>
              ) : null}

              <ListItem>
                <ListItemText primary="Items Total:" secondary={'₱' + itemsTotal.toLocaleString()} />
              </ListItem>
              {/* {new AppConfig().getNoVat() ? null : 
              (vat > 0) ?
              (
                <ListItem>
                  <ListItemText primary="Tax:" secondary={'₱' + vat.toLocaleString()} />
                </ListItem>
              ) : null
              } */}

              <ListItem>
                <ListItemText primary="Delivery Fee:" secondary={'₱' + deliveryFee.toLocaleString()} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Grand Total:" secondary={'₱' + grandTotal.toLocaleString()} />
              </ListItem>
            </div>
          </List>

          {/* <div className="flex flex-col justify-between lg:flex-row w-8/12 ">
            <div className="flex xl:w-2/6 lg:w-2/6 md:w-full sm:w-full flex-col m-5 gap-3">
              {area.includes('lalamoveServiceArea') ? (
                <div className="flex flex-col gap-3">
                  {deliveryVehicle == null ? null : (
                    <Typography variant="h5">Delivery Vehicle : {deliveryVehicle}</Typography>
                  )}
                  {maxWeight == null ? null : <Typography variant="h5"> Max Weight : {maxWeight} Kg</Typography>}
                </div>
              ) : null}
              {totalWeight ? <Typography variant="h5">Weight of Items: {totalWeight} Kg</Typography> : null}
            </div>

            <div className="flex flex-col xl:w-2/6 lg:w-2/6 md:w-full sm:w-full gap-3 m-5 ">
              <Typography variant="h5">Items Total: ₱ {total.toLocaleString()}</Typography>
              <Typography variant="h5">Tax: ₱ {vat.toLocaleString()} </Typography>
              {area.includes('lalamoveServiceArea') ? (
                <Typography variant="h5">Delivery Fee: ₱ {deliveryFee.toLocaleString()}</Typography>
              ) : (
                <>
                  <Typography variant="h5">Cebu Port Fees: ₱ {deliveryFee.toLocaleString()}</Typography>
                  <Typography variant="h5">Shipping Fee: Freight Collect</Typography>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row   ">
            <Typography className="underline underline-offset-8" variant="h4">
              Grand Total: ₱{' '}
            </Typography>
            <div className="flex justify-center">
              <Typography id="checkoutItemsTotal" className="underline underline-offset-8" variant="h4">
                {grandTotal.toLocaleString()}
              </Typography>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default CheckoutSummary;
