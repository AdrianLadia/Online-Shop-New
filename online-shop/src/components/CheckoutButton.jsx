import React from 'react';
import { useContext, useState, useEffect } from 'react';
import AppContext from '../AppContext';
import GuestSignInModal from './GuestSignInModal';
import { CircularProgress } from '@mui/material';

const CheckoutButton = (props) => {

  const totalPrice = props.totalPrice
  const { userId, cart, setGuestLoginClicked, goToCheckoutPage, setGoToCheckoutPage, userdata } = useContext(AppContext);
  const [openGuestSignInModal,setOpenGuestSignInModal] = useState(false);
  const [totalCredit, setTotalCredit] = useState(0);

  useEffect(()=>{
    if (userdata != null) {
      let credit = 0
      userdata.orders.map((s)=>{
        credit += s.grandTotal;
      })
      setTotalCredit(credit + totalPrice)
    }
  },[])

  function handleCloseGuestSignInModal(){
    setOpenGuestSignInModal(false)
  }

  function onCheckoutButtonClick() {
    // if(totalCredit < 50000){
      if (userId === null) {
        localStorage.setItem('cart', JSON.stringify(cart));
        
        setOpenGuestSignInModal(true);
        setGuestLoginClicked(true);
      }
      if (userId !== null) {
        setGoToCheckoutPage(true)
      }
    // }else{
    //   alert("Your total credit will be " + totalCredit + ". You cannot make a purchase if your total credit is 50,000 and above.")
    // }
  }

  return (
    <div>
      <button
        id="cartcheckoutbutton"
        onClick={onCheckoutButtonClick}
        className="bg-color10b w-24 hover:bg-blue-700 hover:animate-bounce text-white p-2 rounded-md mt-5"
      >
        {goToCheckoutPage ? 
         <CircularProgress className="text-white" size="2vh" />
         : "Checkout"}
        
      </button>

      <GuestSignInModal handleCloseGuestSignInModal={handleCloseGuestSignInModal} openGuestSignInModal={openGuestSignInModal}/> 
    </div>
  );
};

export default CheckoutButton;
