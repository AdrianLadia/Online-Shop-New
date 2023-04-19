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

async function PaymayaSdk(setMayaRedirectUrl,setMayaCheckoutId,firstName,lastName,eMail,phoneNumber,totalPrice,customerAddress,geocodeAddress,items) {
  const appConfig = new AppConfig();  
  const firstname = firstName;
  const lastname = lastName;
  const email = eMail;
  const phonenumber = phoneNumber;
  const totalprice = totalPrice;

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
    totalAmount: {
      value: totalprice,
      currency: 'PHP',
      details: {
        discount: 0,
        serviceCharge: 0,
        shippingFee: 0,
        tax: 0,
        subtotal: totalprice,
      },
    },
    buyer: {
      firstName: firstname,
      middleName: '',
      lastName: lastname,
      birthday: '',
      customerSince: '',
      sex: '',
      contact: {
        phone: phonenumber,
        email: email,
      },
      shippingAddress: {
        firstName: 'Adrian Anton',
        middleName: 'Domingo',
        lastName: 'Ladia',
        phone: '+639178927206',
        email: 'ladiaadrian@gmail.com',
        line1: 'P. Sanchez St.',
        line2: '',
        city: 'Camnduman,Mandaue City',
        state: 'Cebu',
        zipCode: '6014',
        countryCode: 'PH',
        shippingType: 'ST', // ST - for standard, SD - for same day
      },
      billingAddress: {
        line1: customerAddress,
        line2: geocodeAddress,
        city: '',
        state: '',
        zipCode: '',
        countryCode: 'PH',
      },
    },
    items: [
      {
        name: 'Canvas Slip Ons',
        quantity: 1,
        code: 'CVG-096732',
        description: 'Shoes',
        amount: {
          value: 100,
          details: {
            discount: 0,
            serviceCharge: 0,
            shippingFee: 0,
            tax: 0,
            subtotal: 100,
          },
        },
        totalAmount: {
          value: 100,
          details: {
            discount: 0,
            serviceCharge: 0,
            shippingFee: 0,
            tax: 0,
            subtotal: 100,
          },
        },
      },
    ],
    redirectUrl: {
      success: 'http://localhost:5173/checkout',
      failure: 'http://localhost:5173/checkout',
      cancel: 'http://localhost:5173/checkout',
    },
    requestReferenceNumber: '1551191039',
    metadata: {},
  };

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
