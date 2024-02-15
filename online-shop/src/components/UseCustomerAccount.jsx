import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../AppContext';
import { Autocomplete, TextField, Modal, Box, Typography } from '@mui/material';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { CircularProgress } from '@mui/material';
import { Firestore } from '@google-cloud/firestore';

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
  const {
    db,
    cloudfirestore,
    businesscalculations,
    userdata,
    alertSnackbar,
    setUserId,
    setManualCustomerOrderProcess,
    firestore,
  } = useContext(AppContext);
  const [selectedManualCustomer, setSelectedManualCustomer] = useState(null);
  const [manualCustomers, setManualCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();
  useEffect(() => {
    const docRef = collection(db, 'Users');
    const q = query(docRef, where('isAccountClaimed', '==', false));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userData = [];
      querySnapshot.forEach((doc) => {
        userData.push(doc.data());
      });

      const _userData = userData.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        }
        return 0;
      });

      console.log('Manual Customers', _userData);

      setManualCustomers(_userData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function createCustomer() {
    setLoading(true);

    try {
      await businesscalculations.createCustomer(customerName, userdata.uid, cloudfirestore);
      alertSnackbar('success', 'Customer Created Successfully');
      setCustomerName('');
      setOpenAddCustomerModal(false);
      setLoading(false);
    } catch (error) {
      console.log(e);
      alertSnackbar('error', 'Error creating customer');
      setLoading(false);
    }
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
              <button className="p-3 rounded-lg  mt-4 bg-color10b" onClick={createCustomer}>
                {!loading ? (
                  <div className="text-white font-bold">Create Customer</div>
                ) : (
                  <CircularProgress size={19} style={{ color: 'white' }} />
                )}
              </button>
            </div>
          </Box>
        </Modal>
      </div>
      <div className="flex flex-row gap-5">
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
        <button
          className="flex items-center p-3 rounded-lg bg-color10b mb-20"
          onClick={async () => {

            function isLocalhost() {
              return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
          }
          
            let url
            if (isLocalhost()) {
              url = 'http://localhost:5173/claimAccount' 
            }
            else {
              url = 'https://starpack.ph/claimAccount'
            }

            navigator.clipboard.writeText(url + '?claimId=' + selectedManualCustomer.uid + '&aid=' + userdata.uid );
            alertSnackbar('info', 'Copied Customer Share Link to Clipboard');
          }}
        >
          <span className="text-white font-bold mr-1">Share</span>
        </button>
      </div>
    </div>
  );
}

export default UseCustomerAccount;
