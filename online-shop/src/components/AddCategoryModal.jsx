import React from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import firestoredb from './firestoredb';
import { useContext } from 'react';
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
    pt: 2,
    px: 4,
    pb: 3,
  };

const AddCategoryModal = (props) => {

    const [
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

    const open = props.openAddCategoryModal
    const [category, setCategory] = React.useState('')

    function close() {
        props.setOpenAddCategoryModal(false)
    }

    function addCategory() {
        firestore.createCategory(category)
        props.setRefresh(!props.refresh)

    }

  return (
    <div>
      <Modal
        open={open}
        onClose={close}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 300 }}>
        <div className='flex flex-col items-center'>
            <TextField required id="outlined-basic" label="Category" variant="outlined" sx={{width:'90%',marginTop:1}} onChange={(event) => setCategory(event.target.value)} />
            <button className='bg-blue-300 rounded-lg p-3 mt-5' onClick={addCategory}>Add New Category</button>
        </div>
        </Box>
      </Modal>
    </div>
  )
}

export default AddCategoryModal
