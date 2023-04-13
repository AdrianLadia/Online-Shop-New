import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import LoginButton from './LoginButton';


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

const GuestSignInModal = (props) => {
  const openGuestSignInModal = props.openGuestSignInModal;
  const handleCloseGuestSignInModal = props.handleCloseGuestSignInModal;
  
    return (
    <>
      <Modal
        open={openGuestSignInModal}
        onClose={handleCloseGuestSignInModal}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style}}>
            <div className='flex flex-col'>
                <div className='flex justify-center mt-5'>
                    <h2 id="child-modal-title">You must be signed in to place an order</h2>
                </div>
                <div id='loginGuest' className='flex justify-center items-center mt-5'>
                    <LoginButton position={'center'} handleCloseGuestSignInModal={handleCloseGuestSignInModal} />
                </div>
            </div>
          
        </Box>
      </Modal>
    </>
  );
};

export default GuestSignInModal;
