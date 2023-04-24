import React from 'react';
import firestoredb from '../firestoredb';
import { useEffect, useState } from 'react';
import OrdersCalendar from './OrdersCalendar';
import { Typography } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import AdminOrdersTable from './AdminOrdersTable';
import MyOrderCardModal from './MyOrderCardModal';
import dataManipulation from '../../utils/dataManipulation';
import AppContext from '../AppContext';
import {ThemeProvider } from '@mui/material/styles';
import theme from "../colorPalette/MaterialUITheme";
import Divider from '@mui/material/Divider';
import textFieldStyle from '../colorPalette/textFieldStyle';
import textFieldLabelStyle from '../colorPalette/textFieldLabelStyle';
import {BsFillBagCheckFill } from "react-icons/bs";

const AdminOrders = (props) => {
  const { firestore } = React.useContext(AppContext);

  const styles = textFieldStyle();
  const labelStyle = textFieldLabelStyle();
  const datamanipulation = new dataManipulation();
  const label = { inputProps: { 'aria-label': 'Switch demo' } };
  const [orders, setOrders] = React.useState([]);
  const [startDate, setStartDate] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [delivered, setDelivered] = useState(null);
  const [paid, setPaid] = useState(null);
  const [selectedName, setSelectedName] = React.useState('');
  const [allUserNames, setAllUserNames] = React.useState([]);
  const [selectedOrderReference, setSelectedOrderReference] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const users = props.users;

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const customers = [];
    users.map((user) => {
      customers.push(user.name);
    });
    setAllUserNames(customers);
  }, [users]);

  useEffect(() => {
    if (referenceNumber !== '') {
      orders.map((order) => {
        if (order.reference === referenceNumber) {
          setOrders([order]);
          return;
        }
      });
    } else {
      
      firestore.readAllOrders().then((ordersFirestore) => {
        const filteredOrders = datamanipulation.filterOrders(
          ordersFirestore,
          startDate,
          referenceNumber,
          delivered,
          paid,
          selectedName
        );
        setOrders(filteredOrders);
      });
    }
  }, [startDate, referenceNumber, delivered, paid, selectedName]);

  useEffect(() => {
    orders.map((order) => {
      if (order.reference === selectedOrderReference) {
        setSelectedOrder(order);
      }
    });
  }, [selectedOrderReference]);

  return (
    
    <div className="flex flex-col w-full items-center bg-gradient-to-r from-colorbackground via-color2 to-color1 ">
      <div className="flex md:flex-row flex-row-reverse justify-center mt-6 md:-ml-14">
        <Typography variant="h2">Orders </Typography>
        <BsFillBagCheckFill/> 
      </div>

      <Divider sx={{border:1}} className='w-11/12 my-5 border-black'/>

      <div className="flex flex-col gap-2 justify-evenly items-center mt-20 w-full lg:w-10/12 lg:flex-row h-28 lg:mt-2">
        <div className="flex flex-row justify-center h-14 lg:w-1/4">
          <div className="flex w-44 sm:w-56">
            <TextField
              id="outlined-basic"
              label="Reference #"
              variant="outlined"
              InputLabelProps={labelStyle}
              sx={styles}
              onChange={(e) => {
                setReferenceNumber(e.target.value);
              }}
            />
          </div>
          <div className="ml-1 flex">
            <button className="p-3 rounded-lg bg-red-400 hover:bg-red-300 border-2 border-red-600">Clear</button>
          </div>
        </div>

        <div className="flex flex-row justify-center mt-5 h-14 lg:-mt-0 lg:w-1/4 ">
          <div className="flex w-44 sm:w-56">
            <Autocomplete
              onChange={(event, value) => setSelectedName(value)}
              disablePortal
              id="combo-box-demo"
              options={allUserNames}
              sx={styles}
              renderInput={(params) => <TextField {...params} 
              label="Customer Name" 
              InputLabelProps={labelStyle}
              />}
            />
          </div>
          <div className="ml-1 flex">
            <button className="p-3 rounded-lg bg-red-400 hover:bg-red-300 border-2 border-red-600">Clear</button>
          </div>
        </div>

        <div className="flex flex-row justify-center mt-5 lg:-mt-0 lg:w-1/4 h-14">
          <div className="flex w-44 sm:w-56">
            <OrdersCalendar startDate={startDate} setStartDate={setStartDate} />
          </div>
          <div className='flex ml-1'>
            <button
              onClick={() => {setStartDate('')}}
              className=" p-3 rounded-lg bg-red-400 hover:bg-red-300 border-2 border-red-600"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-row mt-28 lg:mt-1 w-11/12 md:w-5/12 justify-evenly">
          <div className="">
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="Disabled"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="Paid"
                  control={<Radio />}
                  label="Paid"
                  onClick={(e) => {
                    setPaid(true);
                  }}
                />
                <FormControlLabel
                  value="Unpaid"
                  control={<Radio />}
                  label="Unpaid"
                  onClick={(e) => {
                    setPaid(false);
                  }}
                />
                <FormControlLabel
                  value="Disabled"
                  control={<Radio />}
                  label="Disabled"
                  onClick={(e) => {
                    setPaid(null);
                  }}
                />
              </RadioGroup>
            </FormControl>
          </div>

          <div className="">
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="Disabled"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="Delivered"
                  control={<Radio />}
                  label="Delivered"
                  onClick={(e) => {
                    setDelivered(true);
                  }}
                />
                <FormControlLabel
                  value="Not Delivered"
                  control={<Radio />}
                  label="Not Delivered"
                  onClick={(e) => {
                    setDelivered(false);
                  }}
                />
                <FormControlLabel
                  value="Disabled"
                  control={<Radio />}
                  label="Disabled"
                  onClick={(e) => {
                    setDelivered(null);
                  }}
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>

      <Divider sx={{marginTop: 3, marginBottom:3}} />

      <div className="w-11/12 border-2 border-color60 rounded-lg">
        <AdminOrdersTable
          orders={orders}
          setSelectedOrderReference={setSelectedOrderReference}
          handleOpenModal={handleOpenModal}
        />
      </div>

      {selectedOrder !== null ? (
        <MyOrderCardModal open={openModal} handleClose={handleClose} order={selectedOrder} />
      ) : null}
      {/* Table */}
      {/* Date */}
      {/* Reference # */}
      {/* Account Name */}
      {/* Paid */}
      {/* Delivered */}
      <Divider sx={{ marginTop: 10 , marginBottom:10}} />
      
    </div>
   
  );
};

export default AdminOrders;
