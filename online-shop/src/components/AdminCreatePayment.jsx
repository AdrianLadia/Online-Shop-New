import { TextField, Typography } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import firestoredb from '../firestoredb';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import dataManipulation from '../../utils/dataManipulation';
import AppContext from '../AppContext';
import { useContext } from 'react';
import Divider from '@mui/material/Divider';
import {ThemeProvider } from '@mui/material/styles';
import theme from "../colorPalette/MaterialUITheme";
import textFieldStyle from '../colorPalette/textFieldStyle';
import textFieldLabelStyle from '../colorPalette/textFieldLabelStyle';
import { IoCashOutline } from "react-icons/io5";
import { HiCash } from "react-icons/hi";

const AdminCreatePayment = (props) => {
  const { firestore } = useContext(AppContext);

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
    firestore.transactionCreatePayment(userid, amount, reference, paymentProvider);
  }

  useEffect(() => {
    console.log(amount)
  }, [amount]);

  return (
    <ThemeProvider theme={theme}>
    <div className="flex flex-col items-center bg-gradient-to-r from-colorbackground via-color2 to-color1">
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

        {/* <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel required id="demo-simple-select-label">Customer Name</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedName}
            label="selectedName"
            onChange={handleChange}
          >
            {users.map((user) => {
              return <MenuItem value={user.uid}>{user.name}</MenuItem>
            })}
          </Select>
        </FormControl>
      </Box> */}

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

      </div>
      <Divider sx={{ marginTop: 10 , marginBottom:10}} />
    </div>
    </ThemeProvider>
  );
};

export default AdminCreatePayment;
