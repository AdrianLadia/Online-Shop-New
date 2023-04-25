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

const CheckoutSummary = (props) => {
  const { firestore, cart,products } = useContext(AppContext);

  let [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const datamanipulation = new dataManipulation();
  const setVat = props.setVat;
  const total = props.total;
  const setTotal = props.setTotal;
  const deliveryFee = props.deliveryFee;
  const grandTotal = props.grandTotal;
  const vat = props.vat;
  const setTotalWeight = props.setTotalWeight;
  const totalWeight = props.totalWeight;;
  const deliveryVehicle = props.deliveryVehicleObject.name 
  const maxWeight = props.deliveryVehicleObject.maxWeight;
  const area = props.area;
  const setMayaCheckoutItemDetails = props.setMayaCheckoutItemDetails;

  useEffect(() => {
    async function getTableData() {
      const [rows_non_state, total_non_state, total_weight_non_state,vat] = datamanipulation.getCheckoutPageTableDate(
        products,
        cart
      );
      setVat(vat);
      setMayaCheckoutItemDetails(rows_non_state);
      setRows(rows_non_state);
      setLoading(false);
      setTotal(total_non_state);
      setTotalWeight(total_weight_non_state);
    }
    getTableData();
  }, [cart]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className='flex flex-col align-center items-center gap-4 '>
          <TableContainer component={Paper} elevation={10} className='flex align-center w-11/12 m-2'>
            <Table sx={{ minWidth: 650}} className=' font-bold border-2 border-color60' aria-label="simple table" >
              <TableHead>
                <TableRow className='bg-color10c' >
                  <TableCell >Image</TableCell>
                  <TableCell> Item</TableCell>
                  <TableCell align="right">Quantity</TableCell>
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
                    <TableCell align="right">{row.itemprice}</TableCell>
                    <TableCell align="right">{row.itemtotal}</TableCell>
                    <TableCell align="right">{row.weighttotal + ' Kg'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="flex flex-col justify-between lg:flex-row w-8/12 ">
            <div className="flex xl:w-2/6 lg:w-2/6 md:w-full sm:w-full flex-col m-5 gap-3">
                {area.includes('lalamoveServiceArea') ? (
                <div className='flex flex-col gap-3'>
                  <Typography variant="h5">Delivery Vehicle : {deliveryVehicle}</Typography>
                  <Typography variant="h5"> Max Weight : {maxWeight} Kg</Typography>
                </div>
                ) : null}
                  <Typography variant="h5">Weight of Items: {totalWeight} Kg</Typography>
            </div>

            <div className="flex flex-col xl:w-2/6 lg:w-2/6 md:w-full sm:w-full gap-3 m-5 ">
                  
                  <Typography  variant="h5">Items Total: ₱ {total.toLocaleString()}</Typography>
                  <Typography variant="h5" >Tax: ₱ {vat.toLocaleString()} </Typography>
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
          <div className='flex flex-row'> 
          <Typography  className='underline underline-offset-8' variant="h4">Grand Total: ₱ </Typography>
          <Typography id='checkoutItemsTotal' className='underline underline-offset-8' variant="h4">{grandTotal.toLocaleString()}</Typography>
          </div>
        
        </div>
        )}
    </div>
  );
};

export default CheckoutSummary;
