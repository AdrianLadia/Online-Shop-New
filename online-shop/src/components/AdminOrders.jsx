import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Typography } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import AdminOrdersTable from './AdminOrdersTable';
import MyOrderCardModal from './MyOrderCardModal';
import AppContext from '../AppContext';
import Divider from '@mui/material/Divider';
import textFieldStyle from '../colorPalette/textFieldStyle';
import textFieldLabelStyle from '../colorPalette/textFieldLabelStyle';
import { BsFillBagCheckFill } from 'react-icons/bs';
import { collection, where, query, onSnapshot } from 'firebase/firestore';
import menuRules from '../../utils/classes/menuRules';
import NotificationSound from '../sounds/delivery.mp3';

const AdminOrders = (props) => {
  const { userdata, cloudfirestore, db, firestore} = React.useContext(AppContext);

  const styles = textFieldStyle();
  const labelStyle = textFieldLabelStyle();
  const label = { inputProps: { 'aria-label': 'Switch demo' } };
  const [orders, setOrders] = React.useState([]);
  const [startDate, setStartDate] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [delivered, setDelivered] = useState(false);
  const [paid, setPaid] = useState(true);
  const [selectedName, setSelectedName] = React.useState('');
  const [allUserNames, setAllUserNames] = React.useState([]);
  const [selectedOrderReference, setSelectedOrderReference] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [allUsers, setAllUsers] = React.useState([]);
  const handleOpenModal = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  const dummy = useRef(null);
  const rules = new menuRules(userdata.userRole);
  let unsubscribe = null;

  const users = props.users 

  useEffect(() => {
    if (users) {
      setAllUsers(users);
    }
    else {
      firestore.readAllUsers().then((users) => {
        setAllUsers(users);
      });
    }

  }, [users]);

  const playSound = () => {
    const audioEl = document.getElementsByClassName('audio-element')[0];
    audioEl.play();
  };

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (users != null) {
      const customers = [];
      users.map((user) => {
        customers.push(user.name);
      });
      setAllUserNames(customers);
    }
  }, [users]);

  useEffect(() => {
    const filter = orders.filter((order) => {
      return order.userName === selectedName;
    });
  
    setOrders(filter);
  }, [selectedName]);

  useEffect(() => {
    if (unsubscribe !== null) {
      unsubscribe();
    }

    const docRef = collection(db, 'Orders');

    const q = query(docRef, where('paid', '==', paid), where('delivered', '==', delivered));
    const unsubscribe2 = onSnapshot(q, (querySnapshot) => {
      const ordersData = [];
      querySnapshot.forEach((doc) => {
        ordersData.push(doc.data());
      });

      if (ordersData.length > orders.length) {
        playSound();
      }

      setOrders(ordersData);
    });

    return () => unsubscribe2();
  }, [paid, delivered]);

  useEffect(() => {
    orders.map((order) => {
      if (order.reference === selectedOrderReference) {
        setSelectedOrder(order);
      }
    });
  }, [selectedOrderReference]);

  useEffect(() => {
    if (selectedOrder !== null) {
      handleOpenModal();
    }
  }, [selectedOrder]);

  async function deleteExpiredOrders() {
    await cloudfirestore.deleteOldOrders();
  }

  function onReferenceClearClick() {
    setReferenceNumber('');
  }

  return (
    <>
      {rules.checkIfUserAuthorized('orders') ? (
        <div>
          <div className="flex flex-col w-full items-center bg-gradient-to-r from-colorbackground via-color2 to-color1 ">
            <div ref={dummy} />
            <div className="flex md:flex-row flex-row-reverse justify-center mt-6 md:-ml-14">
              <Typography variant="h2">Orders </Typography>
              <BsFillBagCheckFill />
            </div>

            <Divider sx={{ border: 1 }} className="w-11/12 my-5 border-black" />

            {/* <div className="flex flex-col gap-2 justify-evenly items-center mt-20 w-full lg:w-10/12 lg:flex-row h-28 lg:mt-2">
              <div className="flex flex-row justify-center h-14 lg:w-1/4">
                <div className="flex w-44 sm:w-56">
                  <TextField
                    id="outlined-basic"
                    label="Reference #"
                    variant="outlined"
                    InputLabelProps={labelStyle}
                    sx={styles}
                    value={referenceNumber}
                    onChange={(e) => {
                      setReferenceNumber(e.target.value);
                    }}
                  />
                </div>
                <div className="ml-1 flex">
                  <button onClick={onReferenceClearClick} className="p-3 rounded-lg text-white bg-red1 hover:bg-red-400 border-2 border-red-600">
                    Clear
                  </button>
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
                    renderInput={(params) => (
                      <TextField {...params} label="Customer Name" InputLabelProps={labelStyle} />
                    )}
                  />
                </div>
                <div className="ml-1 flex">
                  <button className="p-3 rounded-lg text-white bg-red1 hover:bg-red-400 border-2 border-red-600">
                    Clear
                  </button>
                </div>
              </div>

              <div className="flex flex-row justify-center mt-5 lg:-mt-0 lg:w-1/4 h-14">
                <div className="flex w-44 sm:w-56">
                  <OrdersCalendar startDate={startDate} setStartDate={setStartDate} />
                </div>
                <div className="flex ml-1">
                  <button
                    onClick={() => {
                      setStartDate('');
                    }}
                    className=" p-3 rounded-lg text-white bg-red1 hover:bg-red-400 border-2 border-red-600"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div> */}

            <div className="flex flex-row mt-20 xs:mt-28 lg:mt-1 w-11/12 md:w-5/12 justify-evenly">
              <div className="">
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="Paid"
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
                    {/* <FormControlLabel
                    value="Disabled"
                    control={<Radio />}
                    label="Disabled"
                    onClick={(e) => {
                      setPaid(null);
                    }}
                  /> */}
                  </RadioGroup>
                </FormControl>
              </div>

              <div className="">
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="Not Delivered"
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
                    {/* <FormControlLabel
                    value="Disabled"
                    control={<Radio />}
                    label="Disabled"
                    onClick={(e) => {
                      setDelivered(null);
                    }}
                  /> */}
                  </RadioGroup>
                </FormControl>
              </div>
            </div>

            <Divider sx={{ marginTop: 3, marginBottom: 3 }} />

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
            {/* <Divider sx={{ marginTop: 10 , marginBottom:10}} /> */}
          </div>
          <div className="flex justify-start mt-20 ml-20 mb-10">
            <button
              onClick={deleteExpiredOrders}
              className="p-3 rounded-lg text-white bg-red1 hover:bg-red-400 border-2 border-red-600"
            >
              Delete Expired Orders
            </button>
          </div>
        </div>
      ) : (
        <>UNAUTHORIZED</>
      )}
      <audio className="audio-element">
        <source src={NotificationSound}></source>
      </audio>
    </>
  );
};

export default AdminOrders;
