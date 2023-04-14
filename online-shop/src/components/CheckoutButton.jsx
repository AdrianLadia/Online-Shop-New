import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext,useState } from 'react';
import AppContext from '../AppContext';
import GuestSignInModal from './GuestSignInModal';
import { CircularProgress, Typography } from '@mui/material';

const CheckoutButton = () => {
  const navigateTo = useNavigate();
  const { userId, cart,setGuestLoginClicked,goToCheckoutPage,setGoToCheckoutPage } = useContext(AppContext);
  const [openGuestSignInModal,setOpenGuestSignInModal] = useState(false);

  function handleCloseGuestSignInModal(){
    setOpenGuestSignInModal(false)
  }

  function onCheckoutButtonClick() {
    if (userId === null) {
      localStorage.setItem('cart', JSON.stringify(cart));
      setOpenGuestSignInModal(true);
      setGuestLoginClicked(true);
    }
    if (userId !== null) {
      setGoToCheckoutPage(true)
    }
  }


  return (
    <div>
      <button
        id="cartcheckoutbutton"
        onClick={onCheckoutButtonClick}
        className="bg-color10b w-24 hover:bg-blue-700 hover:animate-bounce text-white p-2 rounded-md mt-5"
      >
        {goToCheckoutPage ? 
         <CircularProgress size="2vh" />
         : "Checkout"}
        
      </button>

      <GuestSignInModal handleCloseGuestSignInModal={handleCloseGuestSignInModal} openGuestSignInModal={openGuestSignInModal}/> 
    </div>
  );
};

export default CheckoutButton;
