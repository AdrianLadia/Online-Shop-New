import { TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import React from 'react';
import { useEffect, useRef } from 'react';
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
import AdminCreatePaymentTable from './AdminCreatePaymentTable'
import ImageUploadButton from './ImageComponents/ImageUploadButton';
import Joi from 'joi';

const AdminCreatePayment = (props) => {

  const { cloudfirestore,storage } = useContext(AppContext);

  const style = textFieldStyle();
  const labelStyle = textFieldLabelStyle();
  const datamanipulation = new dataManipulation();
  const users = props.users;
  const [selectedName, setSelectedName] = React.useState('');
  const [allUserNames, setAllUserNames] = React.useState([]);
  const [reference, setReference] = React.useState('');
  const [paymentProvider, setPaymentProvider] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const dummy = useRef(null)
  const [paymentLink,setPaymentLink] = React.useState('');

  useEffect(()=>{
    // dummy.current.scrollIntoView({behavior: "smooth"})
  },[props])

  useEffect(() => {
    const customers = datamanipulation.getAllCustomerNamesFromUsers(users);
    setAllUserNames(customers);
  }, [users]);

  function onCreatePayment() {
    const userid = datamanipulation.getUserUidFromUsers(users, selectedName);
    console.log(paymentProvider)
    const data = {
      userId: userid,
      amount: parseFloat(amount),
      reference: reference,
      paymentprovider: paymentProvider,
      proofOfPaymentLink : paymentLink,
    }

    const paymentSchema = Joi.object({
      userId : Joi.string().required(),
      amount : Joi.number().required(),
      reference : Joi.string().required(),
      paymentprovider : Joi.string().required(),
      proofOfPaymentLink : Joi.string().uri().required()
    })

    const {error} = paymentSchema.validate(data)

    if (error) {
      alert(error.message)
    }

    cloudfirestore.transactionCreatePayment(data).then((result) => {
      if (result.data == 'success') {
        alert('Payment Created Successfully');
        // setAmount('');
        // setReference('')
        // setPaymentProvider('')
        // setPaymentLink('') 
      }
      else {
        alert('Payment Creation Failed. Please try again.');
      }
    });
  }

  function onUploadFunction(url) {
    setPaymentLink(url);
  }

  return (
    <ThemeProvider theme={theme}>
    <div className="flex flex-col mb-8 items-center bg-gradient-to-r from-colorbackground via-color2 to-color1">
      <div ref={dummy}></div>
      <div className='flex flex-col gap-10 w-11/12 md:w-9/12 '>
        <div className='flex md:flex-row flex-row-reverse justify-center mt-7'>
          <Typography variant="h2" className="mt-1  flex justify-center"><span>Create Payment</span></Typography>
          <HiCash size={25}/>
        </div>

        <Divider sx={{border:1}}/>

        <div className='grid md:grid-cols-2 gap-5 lg:gap-10'>
        <Autocomplete
          onChange={(event, value) => setSelectedName(value)}
          disablePortal
          id="customerNamePayment"
          options={allUserNames}
          renderInput={(params) => <TextField {...params} label="Customer Name" InputLabelProps={labelStyle} />}
          className='flex w-full'
          sx={style}
        />

        <TextField id='amountPayment' 
          onChange={(event) => setAmount(event.target.value)} 
          required label="Amount" 
          InputLabelProps={labelStyle}
          sx={style}
          value={amount}
          typeof='number'
          />

        <TextField id='referencePayment' 
          onChange={(event) => setReference(event.target.value)} 
          required label="Reference"
          InputLabelProps={labelStyle}
          sx={style}
          value={reference}
          />

        <TextField
          id='paymentProviderPayment'
          onChange={(event) => setPaymentProvider(event.target.value)}
          required
          label="Payment Provider ex. GCash / Paymaya"
          InputLabelProps={labelStyle}
          value={paymentProvider}
          sx={style}
          />
        </div>

        <div className='flex justify-evenly'>
          
          <button 
            id='createPaymentButton' 
            onClick={onCreatePayment}  
            className="w-4/12 sm:w-3/12 lg:p-5 p-3 bg-color10b hover:bg-blue-400 border-2 border-blue1 rounded-lg text-md uppercase"
            >{''}Create Payment{''}
          </button>
          <div className='mt-5'>
            <ImageUploadButton onUploadFunction={onUploadFunction} folderName={'Payments/' + selectedName + '/' + reference} storage={storage} id='createPayment'  buttonTitle='Upload Proof Of Payment'/>
          </div>
        </div>
          <TextField id='proofOfPaymentLink' 
          disabled
          required label="Payment Link"
          InputLabelProps={labelStyle}
          value={paymentLink}
          />
        
        <Divider sx={{border:1}}/>

        <AdminCreatePaymentTable/>
      </div>
    </div>
    </ThemeProvider>
  );
};

export default AdminCreatePayment;
