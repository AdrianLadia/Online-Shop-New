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

async function PaymayaSdk(setMayaRedirectUrl,setMayaCheckoutId,firstName,lastName,eMail,phoneNumber,totalPrice,customerAddress,geocodeAddress,referenceNumber,userId,guestCheckout) {
  const appConfig = new AppConfig();  
  let url 
  let publicKey 
  let secretKey;


  if (appConfig.getIsPaymentSandBox()) {
    url = 'https://pg-sandbox.paymaya.com/checkout/v1/checkouts';
    publicKey = 'pk-Z0OSzLvIcOI2UIvDhdTGVVfRSSeiGStnceqwUE7n0Ah'
    secretKey = 'sk-X8qolYjy62kIzEbr0QRK1h4b4KDVHaNcwMYk39jInSl'
  }
  else {
    url = 'https://pg.maya.ph';
    publicKey = 'pk-DKpOh7gQI1sjjeE4pzTenb8B2n1I3chEmu6UKlJCzYE'
    secretKey = 'sk-c6YLzDpPYtd3AQZNm4i8gcnKQV0FioKXEjyuS074gEj'
  }
 

  const req = {
    "totalAmount": {
         "value": parseFloat(totalPrice),
         "currency": "PHP"
    },
    "buyer": {
         "contact": {
              "email": eMail,
              ...(phoneNumber && { "phone": phoneNumber })
         },
         "shippingAddress": {
              "line1": customerAddress,
              "line2": geocodeAddress,
              "countryCode": "PH"
         },
         "firstName": firstName,
         "lastName": lastName ? lastName : '',
    },
    "redirectUrl": {
         "success": "https://starpack.ph/checkoutSuccess",
         "failure": "https://starpack.ph/checkoutFailed",
         "cancel": "https://starpack.ph/checkoutCancelled"
    },
    "requestReferenceNumber": referenceNumber,
    // "metadata": {
    //   "userId" : userId
    // }
}

  function convertToBase64(key) {
    return btoa(key + ':');
  }

  const headers = {
    Accept: 'application/json',
    Authorization: `Basic ${convertToBase64(publicKey)}`,
    'Content-Type': 'application/json',
  };


  const response = await axios.post(url, req, { headers });
  const checkout = response.data;
  setMayaRedirectUrl(checkout.redirectUrl)
  setMayaCheckoutId(checkout.checkoutId)
}

export default PaymayaSdk;
