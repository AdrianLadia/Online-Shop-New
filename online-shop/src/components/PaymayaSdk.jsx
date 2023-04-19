import AppConfig from '../AppConfig';
import axios from 'axios';

// Maya E-wallet Test Account
// Username: 09193890579
// Password: Password@1
// OTP: 123456

// VISA TEST
// 4834 4228 6994 2474
// 12/2025
// 209

// https://github.com/PayMaya/PayMaya-JS-SDK-v2

async function PaymayaSdk(setMayaRedirectUrl,setMayaCheckoutId,firstName,lastName,eMail,phoneNumber,totalPrice,customerAddress,geocodeAddress,referenceNumber) {
  const appConfig = new AppConfig();  



  if (appConfig.getIsPaymentSandBox()) {
    const url = 'https://pg-sandbox.paymaya.com/checkout/v1/checkouts';
    const publicKey = 'pk-Z0OSzLvIcOI2UIvDhdTGVVfRSSeiGStnceqwUE7n0Ah'
    const secretKey = 'sk-X8qolYjy62kIzEbr0QRK1h4b4KDVHaNcwMYk39jInSl'
  }
  else {
    const url = 'https://pg-sandbox.paymaya.com/checkout/v1/checkouts';
    const publicKey = 'pk-Z0OSzLvIcOI2UIvDhdTGVVfRSSeiGStnceqwUE7n0Ah'
    const secretKey = 'sk-X8qolYjy62kIzEbr0QRK1h4b4KDVHaNcwMYk39jInSl'
  }

  


  const req = {
    "totalAmount": {
         "value": totalPrice,
         "currency": "PHP"
    },
    "buyer": {
         "contact": {
              "email": eMail,
              "phone" : phoneNumber
         },
         "billingAddress": {
              "line1": customerAddress,
              "line2": geocodeAddress,
              "countryCode": "PH"
         },
         "shippingAddress": {
              "line1": customerAddress,
              "line2": geocodeAddress,
              "countryCode": "PH"
         },
         "firstName": firstName,
         "lastName": lastName
    },
    "redirectUrl": {
         "success": "http://localhost:5173/checkoutSuccess",
         "failure": "http://localhost:5173/checkoutFailed",
         "cancel": "http://localhost:5173/checkoutCancelled"
    },
    "requestReferenceNumber": referenceNumber
}

  function convertToBase64(key) {
    return btoa(key + ':');
  }

  const headers = {
    accept: 'application/json',
    authorization: `Basic ${convertToBase64(publicKey)}`,
    'content-type': 'application/json',
  };
  console.log(headers);
  const response = await axios.post(url, req, { headers });
  const checkout = response.data;
  console.log(checkout);
  setMayaRedirectUrl(checkout.redirectUrl)
  setMayaCheckoutId(checkout.checkoutId)
}

export default PaymayaSdk;
