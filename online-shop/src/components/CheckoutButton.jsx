import React from 'react';
import { useContext, useState, useEffect } from 'react';
import AppContext from '../AppContext';
import GuestSignInModal from './GuestSignInModal';
import { CircularProgress } from '@mui/material';
import UnsupportedBrowserRedirect from './UnsupportedBrowserRedirect';
import AppConfig from '../AppConfig';

const CheckoutButton = (props) => {
  const totalPrice = props.totalPrice;
  const {
    analytics,
    userId,
    cart,
    setGuestLoginClicked,
    goToCheckoutPage,
    setGoToCheckoutPage,
    userdata,
    isSupportedBrowser,
    alertSnackbar,
  } = useContext(AppContext);
  const [openGuestSignInModal, setOpenGuestSignInModal] = useState(false);
  const [isSupportedBrowserModalOpen, setIsSupportedBrowserModalOpen] = useState(false);


  function handleCloseGuestSignInModal() {
    setOpenGuestSignInModal(false);
  }

  function onCheckoutButtonClick() {
    analytics.logCheckoutInitiatedEvent(cart);
    const minimumOrder = new AppConfig().getMinimumOrder();
    if (totalPrice < minimumOrder) {
      alertSnackbar('error', 'Minimum order is ' + minimumOrder + ' pesos.');
      return;
    }

    // if (!isSupportedBrowser) {
    //   setIsSupportedBrowserModalOpen(true);
    //   return;
    // }

    if (userId === null) {
    localStorage.setItem('cart', JSON.stringify(cart));
    setOpenGuestSignInModal(true);
    setGuestLoginClicked(true);
    }
    if (userId !== null) {
    setGoToCheckoutPage(true);
    }
  }

  return (
    <div>
      <UnsupportedBrowserRedirect
        open={isSupportedBrowserModalOpen}
        isSupportedBrowser={isSupportedBrowser}
        setOpen={setIsSupportedBrowserModalOpen}
      />
      <button
        id="cartcheckoutbutton"
        onClick={onCheckoutButtonClick}
        className="bg-color10b w-24 hover:bg-color10c hover:animate-bounce text-white p-2 rounded-md mt-5"
      >
        {goToCheckoutPage ? <CircularProgress className="text-white" size="2vh" /> : 'Checkout'}
      </button>

      <GuestSignInModal
        handleCloseGuestSignInModal={handleCloseGuestSignInModal}
        openGuestSignInModal={openGuestSignInModal}
        setOpenGuestSignInModal={setOpenGuestSignInModal}
        setGoToCheckoutPage={setGoToCheckoutPage}
      />

      
    </div>
  );
};

export default CheckoutButton;
