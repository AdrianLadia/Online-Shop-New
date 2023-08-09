import {
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import React from 'react';
import { useEffect, useRef } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import dataManipulation from '../../utils/dataManipulation';
import AppContext from '../AppContext';
import { useContext } from 'react';
import Divider from '@mui/material/Divider';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../colorPalette/MaterialUITheme';
import textFieldStyle from '../colorPalette/textFieldStyle';
import textFieldLabelStyle from '../colorPalette/textFieldLabelStyle';
import { HiCash } from 'react-icons/hi';
import AdminCreatePaymentTable from './AdminCreatePaymentTable';
import ImageUploadButton from './ImageComponents/ImageUploadButton';
import Joi from 'joi';

const AdminCreatePayment = (props) => {
  const { cloudfirestore, storage, firestore } = useContext(AppContext);

  const style = textFieldStyle();
  const labelStyle = textFieldLabelStyle();
  const datamanipulation = new dataManipulation();
  const users = props.users;
  const [selectedName, setSelectedName] = React.useState('');
  const [allUserNames, setAllUserNames] = React.useState([]);
  const [reference, setReference] = React.useState('');
  const [paymentProvider, setPaymentProvider] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const dummy = useRef(null);
  const [paymentLink, setPaymentLink] = React.useState('');
  const [allPaymentProviders, setAllPaymentProviders] = React.useState([])
  const [userid, setUserid] = React.useState('');
  const [unpaidOrdersReference, setUnpaidOrdersReference] = React.useState([]);
  

  useEffect(() => {
    firestore.readAllPaymentProviders().then((result) => {
      const ids = result.map((data) => {return(data.id)});
      setAllPaymentProviders(ids);
    });
  }, []);



  useEffect(() => {
    const customers = datamanipulation.getAllCustomerNamesFromUsers(users);
    setAllUserNames(customers);
  }, [users]);

  useEffect(() => {
    setReference('');
    if (selectedName != '') {
      const userId = datamanipulation.getUserUidFromUsers(users, selectedName);
      setUserid(userId);
      firestore.readAllOrdersByUserId(userId).then((result) => {
        const unpaidOrdersReference = []        
        result.forEach((data) => {
          if (data.paid == false) {
            unpaidOrdersReference.push(data.reference);
          }
        });
        setUnpaidOrdersReference(unpaidOrdersReference);
      });

    }

  }, [selectedName]);

  async function onCreatePayment() {
    
    const data = {
      userId: userid,
      amount: parseFloat(amount),
      reference: reference,
      paymentprovider: paymentProvider,
      proofOfPaymentLink: paymentLink,
    };

    const customerEmail = await firestore.readEmailAddressByUserId(userid);

    const paymentSchema = Joi.object({
      userId: Joi.string().required(),
      amount: Joi.number().required(),
      reference: Joi.string().required(),
      paymentprovider: Joi.string().required(),
      proofOfPaymentLink: Joi.string().uri().required(),
    });

    const { error } = paymentSchema.validate(data);

    if (error) {
      alert(error.message);
    }

    cloudfirestore.transactionCreatePayment(data).then((result) => {
      if (result.data == 'success') {
        alert('Payment Created Successfully');
        setAmount('');
        setReference('');
        setPaymentProvider('');
        setPaymentLink('');
        cloudfirestore.sendEmail({
          to:customerEmail,
          subject:'Payment Created',
          text:'Payment of PHP ' + amount + ' has been accepted by us. Please check your account for more details.'
        }
        );
      } else {
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
        <div className="flex flex-col gap-10 w-11/12 md:w-9/12 ">
          <div className="flex md:flex-row flex-row-reverse justify-center mt-7">
            <Typography variant="h2" className="mt-1  flex justify-center">
              <span>Create Payment</span>
            </Typography>
            <HiCash size={25} />
          </div>

          <Divider sx={{ border: 1 }} />

          <div className="grid md:grid-cols-2 gap-5 lg:gap-10">
            <Autocomplete
              onChange={(event, value) => setSelectedName(value)}
              disablePortal
              id="customerNamePayment"
              options={allUserNames}
              renderInput={(params) => <TextField {...params} label="Customer Name" InputLabelProps={labelStyle} />}
              className="flex w-full"
              sx={style}
            />


            <TextField
              id="amountPayment"
              onChange={(event) => setAmount(event.target.value)}
              required
              label="Amount"
              InputLabelProps={labelStyle}
              sx={style}
              value={amount}
              typeof="number"
            />
            <Autocomplete
              value={reference}
              onChange={(event, value) => setReference(value)}
              disablePortal
              id="referencePayment"
              options={unpaidOrdersReference}
              renderInput={(params) => <TextField {...params} label="Reference" InputLabelProps={labelStyle} />}
              className="flex w-full"
              sx={style}
            />
{/* 
            <TextField
              id="referencePayment"
              onChange={(event) => setReference(event.target.value)}
              required
              label="Reference"
              InputLabelProps={labelStyle}
              sx={style}
              value={reference}
            /> */}

            <Autocomplete
              onChange={(event, value) => setPaymentProvider(value)}
              disablePortal
              id="paymentProviderPayment"
              options={allPaymentProviders}
              renderInput={(params) => <TextField {...params} label="Payment Provider ex. GCash / Paymaya" InputLabelProps={labelStyle} />}
              className="flex w-full"
              sx={style}
            />

            {/* <TextField
              id="paymentProviderPayment"
              onChange={(event) => setPaymentProvider(event.target.value)}
              required
              label="Payment Provider ex. GCash / Paymaya"
              InputLabelProps={labelStyle}
              value={paymentProvider}
              sx={style}
            /> */}
          </div>

          <div className="flex-col gap-10 md:gap-0 md:flex-row flex justify-evenly items-center">
            <button
              id="createPaymentButton"
              onClick={onCreatePayment}
              className="flex justify-center py-2 sm:py-2.5 w-6/12 sm:w-4/12 md:w-3/12 2md:w-4/12 uppercase text-sm sm:text-medium shadow-xl tracking-wide bg-color10b hover:bg-blue-400 rounded-lg ease-in-out duration-300"
            >
              <HiCash className='mr-1.5' size={25} /> <a className='mt-0.5'>Create Payment</a>
            </button>
            <div className="">
              <ImageUploadButton
                onUploadFunction={onUploadFunction}
                folderName={'Payments/' + selectedName + '/' + reference}
                storage={storage}
                id="createPayment"
                buttonTitle="Upload Proof Of Payment"
              />
            </div>
          </div>
          <TextField
            id="proofOfPaymentLink"
            disabled
            required
            label="Payment Link"
            InputLabelProps={labelStyle}
            value={paymentLink}
          />

          <Divider sx={{ border: 1 }} />

          <AdminCreatePaymentTable />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AdminCreatePayment;
