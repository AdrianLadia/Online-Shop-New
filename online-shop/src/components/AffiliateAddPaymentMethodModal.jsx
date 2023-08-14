import React, { useEffect } from 'react';
import { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Autocomplete, TextField } from '@mui/material';
import AppContext from '../AppContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const AffiliateAddPaymentMethodModal = (props) => {
  const {firestore,userdata} = useContext(AppContext);
  const open = props.open;
  const setOpen = props.setOpen;
  const paymentMethodData = props.paymentMethodData;
  const [chosenMethod, setChosenMethod] = useState('');
  const paymentMethods = ['gcash', 'maya', 'bdo', 'unionbank'];
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  function handleMethodChange(event){
    
    let found = false;
    paymentMethodData.forEach((bank)=>{
      if (bank.bank == event) {
        setAccountNumber(bank.accountNumber)
        setAccountName(bank.accountName)
        found = true;
      }
    })

    if (!found) {
      setAccountNumber('')
      setAccountName('')
    }



    setChosenMethod(event);
    

  }

  async function handleUpdateAndSave(){

    if (accountName == '' || accountNumber == '' || chosenMethod == '') {
      alert('Please fill out all fields')
      return;
    }

    

    const res = await firestore.updateAffiliateBankAccount(userdata.uid, {
      bank: chosenMethod,
      accountNumber: accountNumber,
      accountName: accountName
    })
    

    if (res) {
      alert('Updated Payment Method')
      window.location.reload();
    }
    else {
      alert('Failed to Update Payment Method')
    }
  }


  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Autocomplete
            value={chosenMethod}
            disablePortal
            id="combo-box-demo"
            options={paymentMethods}
            sx={{ width: 'full' }}
            onChange={(event, newValue) => {handleMethodChange(newValue);}}
            renderInput={(params) => <TextField {...params} label="Methods" />}
          />
          <TextField value={accountNumber} onChange={(event)=>{setAccountNumber(event.target.value)}} sx={{marginTop:2}} required id="outlined-basic" label="Account Number" variant="outlined" />
          <TextField value={accountName} onChange={(event)=>{setAccountName(event.target.value)}} sx={{marginTop:2}} required id="outlined-basic" label="Account Name" variant="outlined" />
          <Button sx={{marginTop:2,height:40}} variant="contained" onClick={handleUpdateAndSave}>Update and Save</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default AffiliateAddPaymentMethodModal;
