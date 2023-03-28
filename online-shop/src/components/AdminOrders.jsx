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

const AdminOrders = (props) => {
  const { firestore } = React.useContext(AppContext);

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
    <div className=" w-full">
      <div className="flex justify-center">
        <Typography variant="h2">Orders</Typography>
      </div>
      <div className="flex flex-col mt-5 w-full lg:flex-row lg:h-28 lg:mt-20">
        <div className="flex flex-row justify-center lg:h-14 lg:w-1/4">
          <div className="flex">
            <TextField
              id="outlined-basic"
              label="Reference #"
              variant="outlined"
              sx={{ width: '100%' }}
              onChange={(e) => {
                setReferenceNumber(e.target.value);
              }}
            />
          </div>
          <div className="flex">
            <button className="p-3 rounded-lg bg-red-300">Clear</button>
          </div>
        </div>
        <div className="flex flex-row justify-center mt-5  lg:h-14 lg:-mt-0 lg:w-1/4 ">
          <div className="flex w-72  ">
            <Autocomplete
              onChange={(event, value) => setSelectedName(value)}
              disablePortal
              id="combo-box-demo"
              options={allUserNames}
              sx={{ width: '100%' }}
              renderInput={(params) => <TextField {...params} label="Customer Name" />}
            />
          </div>
          <div className="flex">
            <button className="p-3 rounded-lg bg-red-300">Clear</button>
          </div>
        </div>
        <div className="flex flex-row w-full justify-center mt-5 lg:mt-3 lg:w-1/4 lg:h-7 ">
          <div className="flex">
            <Typography variant="h6">Date</Typography>
          </div>
          <div className="flex ml-5">
            <OrdersCalendar startDate={startDate} setStartDate={setStartDate} />
          </div>
          <div>
            <button
              onClick={() => {
                setStartDate('');
              }}
              className="px-2 rounded-lg bg-red-300 h-7"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="flex flex-row justify-center mt-5 lg:-mt-5 lg:w-1/4">
          <div>
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

          <div>
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
      </div>
      <div className="lg:mx-20 mt-5">
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
    </div>
  );
};

export default AdminOrders;
