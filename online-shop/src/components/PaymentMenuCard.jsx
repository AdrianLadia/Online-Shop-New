import React from 'react'
import paymaya from 'paymaya-js-sdk';
import { useEffect, useState } from 'react';
import AppConfig from '../AppConfig';


// https://github.com/PayMaya/PayMaya-JS-SDK-v2

function PaymentMenuCard(props) {
  
  const appConfig = new AppConfig()
  const firstname = props.firstname
  const lastname = props.lastname
  const email = props.email
  const phonenumber = props.phonenumber
  const totalprice = props.totalprice

  const exampleCheckoutObject = {
    "totalAmount": {
      "value": totalprice,
      "currency": "PHP",
      "details": {
        "discount": 0,
        "serviceCharge": 0,
        "shippingFee": 0,
        "tax": 0,
        "subtotal": totalprice
      }
    },
    "buyer": {
      "firstName": firstname,
      "middleName": '',
      "lastName": lastname,
      "birthday": "",
      "customerSince": "",
      "sex": "",
      "contact": {
        "phone": phonenumber,
        "email": email
      },
      "shippingAddress": {
        "firstName": "Adrian Anton",
        "middleName": "Domingo",
        "lastName": "Ladia",
        "phone": "+639181008888",
        "email": "merchant@merchantsite.com",
        "line1": "6F Launchpad",
        "line2": "Reliance Street",
        "city": "Mandaluyong City",
        "state": "Metro Manila",
        "zipCode": "1552",
        "countryCode": "PH",
        "shippingType": "ST" // ST - for standard, SD - for same day
      },
      "billingAddress": {
        "line1": "6F Launchpad",
        "line2": "Reliance Street",
        "city": "Mandaluyong City",
        "state": "Metro Manila",
        "zipCode": "1552",
        "countryCode": "PH"
      }
    },
    "items": [
      {
        "name": "Canvas Slip Ons",
        "quantity": 1,
        "code": "CVG-096732",
        "description": "Shoes",
        "amount": {
          "value": 100,
          "details": {
            "discount": 0,
            "serviceCharge": 0,
            "shippingFee": 0,
            "tax": 0,
            "subtotal": 100
          }
        },
        "totalAmount": {
          "value": 100,
          "details": {
            "discount": 0,
            "serviceCharge": 0,
            "shippingFee": 0,
            "tax": 0,
            "subtotal": 100
          }
        }
      }
    ],
    "redirectUrl": {
      "success": "http://localhost:5173/checkout",
      "failure": "http://localhost:5173/checkout",
      "cancel": "http://localhost:5173/checkout"
    },
    "requestReferenceNumber": "1551191039",
    "metadata": {}
  }
  
    useEffect(() => {
      console.log('PaymentMenuCard useEffect')
      if (appConfig.getIsPaymentSandBox()) {
        paymaya.init('pk-eo4sL393CWU5KmveJUaW8V730TTei2zY8zE4dHJDxkF', true, 'SANDBOX');
      }
      else {
        paymaya.init('pk-1ddpORjAjpC4dbmgFJ0ffZi1fTekKnqza1QBUSBumr8', true)
      }

      async function createCheckout(exampleCheckoutObject) {
        const paymentDetails = await paymaya.createCheckout(exampleCheckoutObject); 
        console.log(paymentDetails)
        return paymentDetails
      }

      const paymentDetails = createCheckout(exampleCheckoutObject)
       
    }, []);

  return (
    <React.Fragment>
        {/* <button onClick={() => setPayMayaCardSelected(!payMayaCardSelected)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> */}
          Paymaya Card
        {/* </button> */}
    </React.Fragment>
  )
}

export default PaymentMenuCard
