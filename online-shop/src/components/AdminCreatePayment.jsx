import { TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import dataManipulation from '../../utils/dataManipulation';
import AppContext from '../AppContext';
import { useContext } from 'react';
import Divider from '@mui/material/Divider';
import {ThemeProvider } from '@mui/material/styles';
import theme from "../colorPalette/MaterialUITheme";
import textFieldStyle from '../colorPalette/textFieldStyle';
import textFieldLabelStyle from '../colorPalette/textFieldLabelStyle';
import { HiCash } from "react-icons/hi";
import { BsFillImageFill,  } from "react-icons/bs";

const AdminCreatePayment = (props) => {
  const { cloudfirestore } = useContext(AppContext);

  // console.log(selectedChatOrderId)

  const style = textFieldStyle();
  const labelStyle = textFieldLabelStyle();
  const datamanipulation = new dataManipulation();
  const users = props.users;
  const [selectedName, setSelectedName] = React.useState('');
  const [allUserNames, setAllUserNames] = React.useState([]);
  const [reference, setReference] = React.useState('');
  const [paymentProvider, setPaymentProvider] = React.useState('');
  const [amount, setAmount] = React.useState(0);

  useEffect(() => {
    const customers = datamanipulation.getAllCustomerNamesFromUsers(users);
    setAllUserNames(customers);
  }, [users]);

  function onCreatePayment() {
    const userid = datamanipulation.getUserUidFromUsers(users, selectedName);
    const data = {
      userId: userid,
      amount: amount,
      reference: reference,
      paymentprovider: paymentProvider,
    }
    cloudfirestore.transactionCreatePayment(data);
  }

  return (
    <ThemeProvider theme={theme}>
    <div className="flex flex-col mb-8 items-center bg-gradient-to-r from-colorbackground via-color2 to-color1">
      <div className='flex flex-col gap-10 w-11/12 md:w-9/12 '>
        <div className='flex md:flex-row flex-row-reverse justify-center mt-7'>
          <Typography variant="h2" className="mt-1  flex justify-center"><span>Create Payment</span></Typography>
          <HiCash size={25}/>
        </div>
        <Divider sx={{border:1}}/>
        <Autocomplete
          onChange={(event, value) => setSelectedName(value)}
          disablePortal
          id="customerNamePayment"
          options={allUserNames}
          renderInput={(params) => <TextField {...params} label="Customer Name" InputLabelProps={labelStyle} />}
          className='flex w-full'
          sx={style}
        />
        <Divider/>
        <TextField id='amountPayment' 
          onChange={(event) => setAmount(parseFloat(event.target.value) )} 
          required label="Amount" 
          InputLabelProps={labelStyle}
          sx={style}
          />
          <Divider/>
        <TextField id='referencePayment' 
          onChange={(event) => setReference(event.target.value)} 
          required label="Reference"
          InputLabelProps={labelStyle}
          sx={style}
          />
          <Divider/>
        <TextField
          id='paymentProviderPayment'
          onChange={(event) => setPaymentProvider(event.target.value)}
          required
          label="Payment Provider ex. GCash / Paymaya"
          InputLabelProps={labelStyle}
          sx={style}
          />
          <Divider/>
        <div className='flex justify-center'>
          <button 
            id='createPaymentButton' 
            onClick={onCreatePayment}  
            className="w-5/12 sm:w-3/12 lg:p-5 p-3 bg-color10b hover:bg-blue-400 border-2 border-blue1 rounded-lg sm:text-2xl text-xl"
            >{' '}Create Payment{' '}
          </button>
        </div>
        <Divider sx={{border:1}}/>

    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650, minHeight: 150 }} className='border border-color60' size="small" aria-label="a dense table">
        <TableHead>
          <TableRow className='bg-color60 border border-color60'>
            <TableCell align="left" className='text-white'>Proof of Payment</TableCell>
            <TableCell align="right" className='text-white'>Reference #</TableCell>
            <TableCell align="center" className='text-white'>Customer ID</TableCell>
            <TableCell align="right" className='text-white'>Payment Method</TableCell>
            <TableCell align="center" className='text-white'>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
           {/* {rows.map((row) => ( */}
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0} }}>
              <TableCell component="th" scope="row" className="text-7xl"><BsFillImageFill/></TableCell>
              <TableCell align="right">Test#12345</TableCell>
              <TableCell align="right">TestUser54321</TableCell>
              <TableCell align="right">maya</TableCell>
              <TableCell align="right" >
                <div className='flex justify-evenly gap-2 '>
                  <button className=' border border-red-400 hover:bg-red-100 text-red-400 px-4 py-3 rounded-xl'>Deny</button>
                  <button className='bg-color60 hover:bg-color10c text-white px-4 py-3 rounded-xl'>Approve</button>
                </div>
              </TableCell>
            </TableRow>
          {/* // ))}  */}
        </TableBody>
      </Table>
    </TableContainer>

      </div>
    </div>
    </ThemeProvider>
  );
};

export default AdminCreatePayment;
