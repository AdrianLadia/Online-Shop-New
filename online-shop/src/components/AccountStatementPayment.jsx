import React, { useState, useEffect, useContext } from 'react';
import PaymentMethods from './PaymentMethods';
import CheckoutContext from '../context/CheckoutContext';
import { Typography, Button } from '@mui/material';
import businessCalculations from '../../utils/businessCalculations';
import { HiCash } from 'react-icons/hi';
import { useLocation } from 'react-router-dom';
import PaymayaSdk from './PaymayaSdk';
import { useNavigate } from 'react-router-dom';
import AppContext from '../AppContext';

const AccountStatementPayment = (props) => {
  const { setSelectedChatOrderId } = useContext(AppContext);
  // const { userdata, cart, setCart, userstate } = React.useContext(AppContext);

  const { setMayaRedirectUrl, setMayaCheckoutId, mayaRedirectUrl, paymentMethodSelected } = useContext(AppContext);
  const [placeOrderLoading, setPlaceOrderLoading] = useState(false);
  const businesscalculations = new businessCalculations();
  const location = useLocation();
  const navigateTo = useNavigate();
  const { eMail, phoneNumber, totalPrice, userId, fullname, orderReference, date } = location.state;

  // WE DO THIS BECAUSE WE ARE USING THE SAME COMPONENT FOR CHECKOUT AND MY ORDER CARD PAYMENT
  // IF WE CHECKOUT NORMALLY WE NEED TO GENERATE A REFERENCENUMBER
  // IF WE ARE PAYING FOR AN ORDER WE NEED TO USE THE ORDERREFERENCE
  function getReference() {
    if (orderReference != null) {
      return orderReference;
    } else {
      return businesscalculations.generateOrderReference();
    }
  }



  useEffect(() => {
    if (mayaRedirectUrl != null) {
      window.location.href = mayaRedirectUrl;
      setMayaRedirectUrl(null);
    }
  }, [mayaRedirectUrl]);

  function checkIfDateExists() {
    if (date != null) {
      return date;
    } else {
      return new Date();
    }
  }

  function payTotal() {
    businesscalculations.afterCheckoutRedirectLogic({
      paymentMethodSelected: paymentMethodSelected,
      referenceNumber: getReference(),
      grandTotal: totalPrice,
      deliveryFee: null,
      vat: null,
      rows: null,
      area: null,
      fullName: fullname,
      eMail: eMail,
      phoneNumber: phoneNumber,
      setMayaRedirectUrl: setMayaRedirectUrl,
      setMayaCheckoutId: setMayaCheckoutId,
      localDeliveryAddress: null,
      addressText: null,
      userId: userId,
      navigateTo: navigateTo,
      itemsTotal: null,
      date: checkIfDateExists(),
    });
  }

  return (
    <div>
      <div className="flex flex-col justify-center gap-16 mb-8">
        <div className="flex ml-5 md:flex-row flex-row-reverse justify-center mt-7">
          <Typography variant="h2" className="mt-1 flex justify-center">
            <span>Payment Method</span>
          </Typography>
          <HiCash size={25} />
        </div>

        <PaymentMethods />

        <Button
          onClick={payTotal}
          className="self-center mt-10 w-2/5 p-5 bg-blue1 hover:bg-color10b rounded-lg text-white font-semibold text-xl"
        >
          Pay
        </Button>
      </div>
    </div>
  );
};

export default AccountStatementPayment;
