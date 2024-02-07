import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../AppContext';
import { Autocomplete, TextField, Modal, Box, Typography } from '@mui/material';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const isSmallScreen = () => {
  return window.innerWidth <= 480; // iPhone screen width or similar
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: isSmallScreen() ? '90%' : '400px', // Use 90% width for small screens
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function UseCustomerAccount() {
  const [openAddCustomerModal, setOpenAddCustomerModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const { db, cloudfirestore, userdata, alertSnackbar, setUserId, setManualCustomerOrderProcess } =
    useContext(AppContext);
  const [selectedManualCustomer, setSelectedManualCustomer] = useState(null);
  const [manualCustomers, setManualCustomers] = useState([]);
  const navigateTo = useNavigate();
  useEffect(() => {
    const docRef = collection(db, 'Users');
    const q = query(docRef, where('isAccountClaimed', '==', false));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userData = [];
      querySnapshot.forEach((doc) => {
        userData.push(doc.data());
      });

      setManualCustomers(userData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function createCustomer() {
    function generateFirestoreId() {
      var id = '';
      var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for (var i = 0; i < 20; i++) {
        id += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return id;
    }
    const userId = generateFirestoreId();
    await cloudfirestore.createNewUser(
      {
        uid: userId,
        name: customerName,
        email: null,
        emailVerified: false,
        phoneNumber: null,
        deliveryAddress: [],
        contactPerson: [],
        isAnonymous: false,
        orders: [],
        cart: {},
        favoriteItems: [],
        payments: [],
        userRole: 'member',
        affiliate: userdata.uid,
        affiliateClaims: [],
        affiliateDeposits: [],
        affiliateCommissions: [],
        bir2303Link: null,
        affiliateId: null,
        affiliateBankAccounts: [],
        joinedDate: new Date(),
        codBanned: { reason: null, isBanned: false },
        isAccountClaimed: false,
        userPrices: {},
      },
      userId
    );
    console.log('Customer Created with id: ' + userId);
    alertSnackbar('success', 'Customer Created Successfully');
    setCustomerName('');
    setOpenAddCustomerModal(false);
  }

  return (
    <div className="flex flex-col  w-9/10 lg:w-400px justify-center items-center ">
      <div className="flex flex-row items-center w-full  gap-5 mb-5">
        <Autocomplete
          value={selectedManualCustomer ? selectedManualCustomer.name : ''}
          options={manualCustomers.map((option) => option.name)}
          disablePortal
          id="combo-box-demo"
          className="w-full"
          onChange={(event, newValue) => {
            const customerData = manualCustomers.find((item) => item.name === newValue);
            console.log(customerData);
            setSelectedManualCustomer(customerData);
          }}
          renderInput={(params) => (
            <TextField
              required
              {...params}
              label="Customer Name"
              className="w-full flex" // Apply w-full here
            />
          )}
        />

        <button
          className="flex items-center p-3 rounded-lg bg-color10b"
          onClick={() => {
            setOpenAddCustomerModal(true);
          }}
        >
          <span className="text-white font-bold mr-1">Add Customer</span>
        </button>
        <Modal
          open={openAddCustomerModal}
          onClose={() => {
            setOpenAddCustomerModal(false);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create Customer
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Please input the customer's details. The customer you created will be tagged as your customer and you can
              earn commission from them.
            </Typography>
            <div className="flex flex-col gap-2 mt-5">
              <TextField
                value={customerName}
                className="ml-3"
                sx={{ width: 'full' }}
                label="Customer Name"
                onChange={(e) => {
                  setCustomerName(e.target.value);
                }}
              />
              <button className="p-3 rounded-lg bg-color10b" onClick={createCustomer}>
                Create Customer
              </button>
            </div>
          </Box>
        </Modal>
      </div>

      <button
        className="flex items-center p-3 rounded-lg bg-color10b mb-20"
        onClick={() => {
          setUserId(selectedManualCustomer.uid);
          setManualCustomerOrderProcess(true);
          navigateTo('/shop');
        }}
      >
        <span className="text-white font-bold mr-1">Create Order</span>
      </button>
    </div>
  );
}

export default UseCustomerAccount;
