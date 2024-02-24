import React, { useEffect, useContext } from 'react';
import { Paper } from '@material-ui/core';
import { useState } from 'react';
import AppContext from '../AppContext';

const PaymentCheckoutCard = (props) => {
  const [cardElevate, setCardElevate] = useState(false);
  const {changeCard, setChangeCard,alertSnackbar} = useContext(AppContext);
  const disabled = props.disabled;

  
  const paymentOption = props.paymentOption;
  let logoLink = null;
  let cardStyle = null;
  let id = null;
  if (paymentOption === 'cod') { 
    logoLink = 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2FCODorCOP.png?alt=media&token=71d22fc9-475f-4f40-b898-f83f455f5d71&_gl=1*1iomi2e*_ga*NDM5ODMxODMzLjE2ODQ0MTcyMTE.*_ga_CW55HF8NVT*MTY5Nzg1ODc0OC4xNTkuMS4xNjk3ODU5MDMzLjU2LjAuMA..'
    
    cardStyle = '';
  }
  if (paymentOption === 'bdo') {
    logoLink =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fbdo.png?alt=media&token=a2714b8c-954d-42c3-bbe3-457ae5f36003';
    cardStyle = 'mt-9';
  } else if (paymentOption === 'bitcoin') {
    logoLink =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fbitcoin.png?alt=media&token=00471d04-c9dc-4934-95b3-798488dc4223';
    cardStyle = 'mt-3 ml-2 h-24';
  } else if (paymentOption === 'ethereum') {
    logoLink =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fethereum.png?alt=media&token=fd02ce44-08cd-4853-bd2f-292495224e50';
    cardStyle = 'h-28 ml-6';
  } else if (paymentOption === 'gcash') {
    logoLink =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fgcash.png?alt=media&token=2f3855d3-b2f8-4e43-83a5-92add10becc4';
    cardStyle = 'mt-6';
  } else if (paymentOption === 'mastercard') {
    logoLink =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fmastercard.png?alt=media&token=7cabdfff-c17f-4bdb-a854-4a0d0f9d343d';
    cardStyle = 'mt-6';
  } else if (paymentOption === 'maya') {
    id = 'mayaPaymentOption';
    logoLink =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fmaya.png?alt=media&token=a940cb2d-4b2a-44d4-88e7-6798621a019a';
    cardStyle = 'mt-11';
  } else if (paymentOption === 'solana') {
    logoLink =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fsolana.jpg?alt=media&token=18c2bc62-5a1e-4220-8d67-e9d99b98f38d';
    cardStyle = ' h-28';
  } else if (paymentOption === 'unionbank') {
    logoLink =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Funionbank.png?alt=media&token=72bf155c-d532-4bca-a9a1-06844e511900';
    cardStyle = 'mt-9 ';
  } else if (paymentOption === 'visa') {
    logoLink =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fvisa.png?alt=media&token=5a8ab580-4b00-477a-86cd-08f5c6b12c31';
    cardStyle = 'mt-10 ';
  } else if (paymentOption === 'wechatpay') {
    logoLink =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fwechat%20pay.png?alt=media&token=6df3a09e-0a10-4f64-b49a-b0aa46a592d6';
    cardStyle = 'mt-5';
  } else if (paymentOption === 'shoppeepay') {
    logoLink =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fshopeepay-img1.png?alt=media&token=a43e3b67-0e85-47bb-a5bb-f425af9b2662';
    cardStyle = 'mt-4';
  }

  
  const cardSelected = props.cardSelected;
  const setCardSelected = props.setCardSelected;
  const setPaymentMethodSelected = props.setPaymentMethodSelected;
  const reason = props.reason;
  const [elevation, setElevation] = useState(5);
  


  useEffect(() => {
    if (cardSelected[paymentOption] === true) {
      setCardElevate(true);
    }
    else {
      setCardElevate(false);
    }
  }, [changeCard]);
  
  function onClick() {
    if (paymentOption === 'bitcoin') {
      alertSnackbar('info','Bitcoin is not yet available. Please choose another payment option.');
      return
    }

    if (disabled === true) {
      alertSnackbar('info','COD is not available, Reason : ' + reason + '. Please choose another payment option.');
      return
    }

    Object.keys(cardSelected).forEach((key) => {

    

      if (key == paymentOption) {
        cardSelected[key] = true;
      }
      else {
        cardSelected[key] = false;
      }
    });

    setPaymentMethodSelected(paymentOption);
    setCardSelected(cardSelected);
    setChangeCard(!changeCard);
  }
  

  useEffect(() => {
    if (cardElevate) {
      setElevation(20);
    } else {
      setElevation(5);
    }
  }, [cardElevate]);

  function style() {
    if (cardElevate === true) {
      return ' h-40 w-40 p-5 border-4 hover:cursor-pointer border-color10b -mt-3 ';
    } else {
      return ' h-40 w-40 p-5 border-4 hover:cursor-pointer mt-5 ';
    }
  }

  return (
    <React.Fragment>
      <Paper className={'mb-6 2xs:mb-0 mx-1' + style()} elevation={elevation} onClick={onClick}>
        <img className={cardStyle} src={logoLink} id={id} />
        {/* <p className="text-lg font-bold text-green-300">Card</p> */}
      </Paper>
    </React.Fragment>
  );
};

export default PaymentCheckoutCard;
