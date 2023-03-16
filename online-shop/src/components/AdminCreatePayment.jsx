import { TextField, Typography } from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import firestoredb from './firestoredb'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import dataManipulation from '../../utils/dataManipulation';
import AppContext from '../AppContext';
import { useContext } from 'react';



const AdminCreatePayment = (props) => {

  [
    userdata,
    setUserData,
    isadmin,
    firestore,
    cart,
    setCart,
    favoriteitems,
    setFavoriteItems,
    userId,
    setUserId,
    refreshUser,
    setRefreshUser,
    userLoaded,
    setUserLoaded,
    deliveryaddress,
    setDeliveryAddress,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    userstate,
    setUserState,
    phonenumber,
    setPhoneNumber,
    orders,
    setOrders,
    payments,
    setPayments,
    contactPerson,
    setContactPerson
  ] = useContext(AppContext);

  const datamanipulation = new dataManipulation()
  const users = props.users
  const [selectedName, setSelectedName] = React.useState('');
  const [allUserNames, setAllUserNames] = React.useState([])
  const [reference, setReference] = React.useState('')
  const [paymentProvider, setPaymentProvider] = React.useState('')
  const [amount, setAmount] = React.useState(0)


  useEffect(() => {
    
    const customers = datamanipulation.getAllCustomerNamesFromUsers(users)
    setAllUserNames(customers);

  }, [users])

  function onCreatePayment() {
    const userid = datamanipulation.getUserUidFromUsers(users,selectedName)
    firestore.transactionCreatePayment(userid,amount,reference,paymentProvider)
  }

  

  return (
    <div className='flex flex-col'>
      <Typography variant='h2' className='flex justify-center'> Create Payment </Typography>
      <Autocomplete
      onChange={(event,value) => setSelectedName(value)}
      disablePortal
      id="combo-box-demo"
      options={allUserNames}
      sx={{ width:'full' }}
      renderInput={(params) => <TextField  {...params} label="Customer Name" />}
    />
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
    <TextField onChange={(event) => setAmount(event.target.value)} required label='Amount' /> 
    <TextField onChange={(event) => setReference(event.target.value)} required label='Reference' />
    <TextField onChange={(event) => setPaymentProvider(event.target.value)} required label='Payment Provider ex... GCash / Paymaya' />
    <button onClick={onCreatePayment} className='p-3 bg-blue-300 rounded-lg'> Create Payment </button>
    </div>

    
  )
}

export default AdminCreatePayment
