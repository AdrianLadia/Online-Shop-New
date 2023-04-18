import React, { useEffect } from "react";
import { Paper } from '@material-ui/core'
import { useState } from 'react';

const PaymentCheckoutCard = (props) => {

    // const [cardSelected, setCardSelected] = useState(false);

    const paymentOption = props.paymentOption;
    let logoLink = null
    let cardStyle = null
    if (paymentOption === 'bdo') {
      logoLink = 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fbdo.png?alt=media&token=a2714b8c-954d-42c3-bbe3-457ae5f36003'
      cardStyle = 'mt-9'
    }
    else if (paymentOption === 'bitcoin') {
      logoLink = 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fbitcoin.png?alt=media&token=00471d04-c9dc-4934-95b3-798488dc4223'
      cardStyle = 'mt-3 ml-2 h-24'
    }
    else if (paymentOption === 'ethereum') {
      logoLink = 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fethereum.png?alt=media&token=fd02ce44-08cd-4853-bd2f-292495224e50'
      cardStyle = 'h-28 ml-6'
    }
    else if (paymentOption === 'gcash') {
      logoLink = 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fgcash.png?alt=media&token=2f3855d3-b2f8-4e43-83a5-92add10becc4'
      cardStyle = 'mt-6'
    }
    else if (paymentOption === 'mastercard') {
      logoLink = 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fmastercard.png?alt=media&token=7cabdfff-c17f-4bdb-a854-4a0d0f9d343d'
      cardStyle = 'mt-6'
    }
    else if (paymentOption === 'maya') {
      logoLink = 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fmaya.png?alt=media&token=a940cb2d-4b2a-44d4-88e7-6798621a019a'
      cardStyle = 'mt-11'
    }
    else if (paymentOption === 'solana') {
      logoLink = 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fsolana.jpg?alt=media&token=18c2bc62-5a1e-4220-8d67-e9d99b98f38d'
      cardStyle = ' h-28'
    }
    else if (paymentOption === 'unionbank') {
      logoLink = 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Funionbank.png?alt=media&token=72bf155c-d532-4bca-a9a1-06844e511900'
      cardStyle = 'mt-9 '
    }
    else if (paymentOption === 'visa') {
      logoLink = 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fvisa.png?alt=media&token=5a8ab580-4b00-477a-86cd-08f5c6b12c31'
      cardStyle = 'mt-10 '
    }

    const cardSelected = props.cardSelected;
    const setCardSelected = props.setCardSelected;
    const [elevation, setElevation] = useState(5);

    function onClick() {
      setCardSelected(!cardSelected);
    }

    useEffect(() => {
      if(cardSelected) {
        setElevation(20);
      }else{
        setElevation(5);
      }
    }, [cardSelected]);

    function style() {
        if (cardSelected === true) {
            return "h-40 w-40 p-5 border-4 hover:cursor-pointer border-color10b -mt-3 "
        }
        else {
            return "h-40 w-40 p-5 border-4 hover:cursor-pointer mt-5 "
        }
    }

  return (
    <React.Fragment>
      <Paper
        className={style()}
        elevation={elevation}
        onClick={onClick}
      >
        <img className={cardStyle}
          src={logoLink}
        /> 
        {/* <p className="text-lg font-bold text-green-300">Card</p> */}
      </Paper>
    </React.Fragment>
  );
};

export default PaymentCheckoutCard;
