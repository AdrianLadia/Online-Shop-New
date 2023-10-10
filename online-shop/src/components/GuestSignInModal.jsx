import React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import LoginButton from './LoginButton';
import { Typography } from '@mui/material';
import HomePageCardSection from '../HomePageCardSection';
import { CircularProgress } from '@material-ui/core';

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
  width: '90%',

};

const GuestSignInModal = (props) => {
  const openGuestSignInModal = props.openGuestSignInModal;
  const handleCloseGuestSignInModal = props.handleCloseGuestSignInModal;
  const setGoToCheckoutPage = props.setGoToCheckoutPage;
  const [loading,setLoading] = useState(false);

  function onCheckoutButtonClick() {
    setLoading(true);
    setGoToCheckoutPage(true);
  }

  return (
    <>
      <Modal
        open={openGuestSignInModal}
        onClose={handleCloseGuestSignInModal}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
          <div className="flex flex-col">
            {/* <div className='flex justify-center mt-5'> */}
            {/* <h2 id="child-modal-title">You are checking out as a guest</h2> */}
            {/* </div> */}
            <div id="checkoutAsGuest" className="flex justify-center items-center mt-5">
              <button onClick={onCheckoutButtonClick} className="px-3 py-2 bg-color10b text-white rounded-lg w-52">
                {loading ? 
                <CircularProgress className="text-white" size={10} />
                : 
                <Typography variant="p" fontWeight={'bold'}>
                  CHECKOUT AS GUEST
                </Typography>
                }
              </button>
            </div>
            <div className='flex w-full justify-center mb-5'>
            <Typography variant="p" fontWeight={'bold'} className="mt-5">
              Create an account to enjoy these features.
            </Typography>
            </div>
            <div className='flex w-full justify-center'>

            <LoginButton position={'center'} handleCloseGuestSignInModal={handleCloseGuestSignInModal} />
            </div>
            <HomePageCardSection
              className={' flex flex-row overflow-x-auto w-full gap-5 px-5 mt-5 shadow-xl '}
              hide={[0, 2, 4, 5]}
            />
            <div id="loginGuest" className="flex justify-center items-center mt-5"></div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default GuestSignInModal;
