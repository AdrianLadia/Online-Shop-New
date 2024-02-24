import React from 'react';
import { useContext, useState, useEffect,startTransition } from 'react';
import ImageUploadButton from './ImageComponents/ImageUploadButton';
import { Button, Divider, Typography } from '@mui/material';
import CheckoutSummary from './CheckoutSummary';
import { Link } from 'react-router-dom';
import AppContext from '../AppContext';
import { useLocation } from 'react-router-dom';
import CountdownTimer from './CountDownTimer';
import { Timestamp } from 'firebase/firestore';
import dataManipulation from '../../utils/dataManipulation';
import { useNavigate } from 'react-router-dom';
import { HiChatBubbleLeftEllipsis } from 'react-icons/hi2';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import { set } from 'date-fns';
import mayaCheckoutPaymentOptions from '../data/mayaCheckoutPaymentOptions';

const CheckoutProofOfPayment = (props) => {
  const {
    alertSnackbar,
    storage,
    cloudfirestore,
    userId,
    userdata,

    refreshUser,
    setRefreshUser,

    datamanipulation,
    mayaRedirectUrl,
    setMayaRedirectUrl,
  } = useContext(AppContext);
  const location = useLocation();
  const {
    referenceNumber,
    itemsTotal,
    deliveryFee,
    grandTotal,
    vat,
    rows,
    area,
    paymentMethodSelected,
    date,
    deliveryVehicle,
    isGuestCheckout,
    kilometersFromStore,
  } = location.state;
  const orderDateObject = new Date(date);
  const orderExpiryDate = new Date(orderDateObject.getTime() + 86400000);
  const dateNow = new Date();
  let dateDifference = datamanipulation.getSecondsDifferenceBetweentTwoDates(dateNow, orderExpiryDate);
  const navigateTo = useNavigate();
  const [containerClassName, setContainerClassName] = useState('w-full h-[calc(100vh-200px)]');
  const latitude = deliveryVehicle?.latitude;
  const longitude = deliveryVehicle?.longitude;
  const [_mayaRedirectUrl, set_mayaRedirectUrl] = useState(null);

  useEffect(() => {
    if (mayaRedirectUrl != null) {
      set_mayaRedirectUrl(mayaRedirectUrl);
      setMayaRedirectUrl(null);
    }
  }, [mayaRedirectUrl]);

  useEffect(() => {
    // analytics.logOpenPaymentPageEvent(
    //   referenceNumber,
    //   itemsTotal,
    //   deliveryFee,
    //   grandTotal,
    //   vat,
    //   area,
    //   paymentMethodSelected,
    //   date,
    //   rows
    // );
  }, []);

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  let bankName;
  let accountName;
  let accountNumber;
  let qrLink;
  let isMaya = false;

  if (paymentMethodSelected == 'bdo') {
    bankName = 'BDO';
    accountName = 'ADRIAN LADIA';
    accountNumber = '006080021403';
  }
  if (paymentMethodSelected == 'unionbank') {
    bankName = 'UNIONBANK';
    accountName = 'ADRIAN LADIA';
    accountNumber = '109355469422';
  }

  if (paymentMethodSelected == 'cod') {
    bankName = 'CASH ON DELIVERY';
    accountName = 'CASH ON DELIVERY';
    accountNumber = 'CASH ON DELIVERY';
  }

  if (paymentMethodSelected == 'maya' || paymentMethodSelected == 'gcash') {
    if (paymentMethodSelected == 'maya') {
      bankName = 'Maya';
    }
    if (paymentMethodSelected == 'gcash') {
      bankName = 'GCash';
    }
    accountName = 'Adrian Ladia'
    accountNumber = '09178927206'
  }

  async function onUpload(url) {
    const timestamp = Timestamp.fromDate(date);
    const timestampString = timestamp.toDate().toLocaleString();

    try {
      setRefreshUser(!refreshUser);
      await cloudfirestore.updateOrderProofOfPaymentLink(referenceNumber, userId, url, userdata.name, bankName);
      await delay(5000);
      startTransition(() => navigateTo('/myorders/orderList'));
    } catch (error) {
      alertSnackbar('error', 'Failed to upload proof of payment. Please try again.');
      return;
    }
  }

  return (
    <div>
      {referenceNumber == null ? (
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg p-10 rounded-lg">
              <h1 className="text-2xl font-bold mb-4">State Refreshed</h1>
              <Typography className="text-gray-600 mb-6">
                The application state has been refreshed. To upload your proof of payment, please visit the
                <strong> "MY ORDERS"</strong> page in your account menu.
              </Typography>
              <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-800">
                Back to home page
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto  py-16">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Thank you for your order!</h2>
            {referenceNumber != '' ? <h3 className="text-2xl mb-4">Reference # : {referenceNumber}</h3> : null}
            {_mayaRedirectUrl != null ? (
              <div className="flex flex-col mb-8 justify-center lg:justify-start">
                <p>
                  You have been automatically redirected to the payment page. If you are not redirected, please click
                  the link below.
                </p>
                <a
                  className=" flex text-blue-600 underline hover:text-blue-800 visited:text-purple-600 "
                  href={_mayaRedirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {qrLink}
                </a>
              </div>
            ) : (
              <>
                {paymentMethodSelected == 'cod' ? null : <p>Please send your payment to the following bank account:</p>}
                <div className="bg-gray-200 rounded p-4 my-4">
                  {paymentMethodSelected === 'cod' ? (
                    deliveryVehicle?.name === 'storePickUp' ? (
                      <p>Please pick up your order at our store and prepare payment.</p>
                    ) : (
                      <p>Please prepare your payment for the delivery.</p>
                    )
                  ) : (
                    <>
                      <Typography>Bank Name: {bankName}</Typography>
                      <Typography>Account Name: {accountName}</Typography>
                      <Typography>Account Number: {accountNumber}</Typography>
                    </>
                  )}
                </div>
              </>
            )}
            {paymentMethodSelected === 'cod' ? null : (
              <>
                {_mayaRedirectUrl !== null ? (
                  <p>
                    Please complete the payment within 1 hour. We will <strong>reserve your items</strong> for 1 hour.
                    If payment is not received within the time frame, your order will be cancelled.
                  </p>
                ) : isGuestCheckout ? (
                  <>
                    <p>
                      Once you have completed the payment, please{' '}
                      <strong>
                        submit proof of payment using the button below or send it in our Facebook Messenger
                      </strong>
                      .
                    </p>
                    <Divider className="my-5" />
                    <p>
                      We will <strong>reserve your items</strong> for 24 hours. If payment is not received within the
                      time frame, your order will be cancelled.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Once you have completed the payment, please{' '}
                      <strong>submit proof of payment using the button below or in My Orders Menu</strong>.
                    </p>
                    <p>
                      We will <strong>reserve your items</strong> for 24 hours. If payment is not received within the
                      time frame, your order will be cancelled.
                    </p>
                  </>
                )}
              </>
            )}

            <Divider className="mt-5 mb-5"></Divider>
            {deliveryVehicle?.name == 'storePickUp' ? (
              <>
                <Typography variant="h6" className="mb-4">
                  Store Pickup Location
                </Typography>
                <GoogleMap
                  clickableIcons={false}
                  zoom={17}
                  center={{ lat: latitude, lng: longitude }}
                  mapContainerClassName={containerClassName}
                  disableDefaultUI={true}
                  mapTypeControl={false}
                  
                >
                  <MarkerF position={{ lat: latitude, lng: longitude }} />
                </GoogleMap>
              </>
            ) : null}
            <Divider className="mt-5 mb-5"></Divider>
            {/* <CheckoutSummary/> */}
            {rows != null ? (
              <CheckoutSummary
                total={itemsTotal}
                vat={vat}
                deliveryFee={deliveryFee}
                grandTotal={grandTotal}
                area={area}
                rows={rows}
                kilometersFromStore={kilometersFromStore}
              />
            ) : (
              <div className="flex justify-center mt-5">
                <Typography>{`Total : ₱ ${grandTotal}`}</Typography>
              </div>
            )}
            <div className="flex flex-col justify-center">
              <div className="flex flex-row justify-center mt-5">
                {paymentMethodSelected === 'cod' ? null : (
                  <>
                    <Typography variant="h7" color={'#69b05c'} sx={{ marginRight: 1 }}>
                      Order will expire in :
                    </Typography>
                    <CountdownTimer initialTime={dateDifference} />
                  </>
                )}
              </div>
              <div className="flex justify-center mt-2">
                <Typography variant="h7" sx={{ marginRight: 1 }}></Typography>
              </div>
            </div>

            {isMaya ? null : isGuestCheckout ? null : paymentMethodSelected == 'cod' ? null : (
              <div className="flex justify-center mt-6">
                <ImageUploadButton
                  onUploadFunction={onUpload}
                  storage={storage}
                  folderName={'Orders/' + userId + '/' + referenceNumber}
                  buttonTitle={'Upload Proof Of Payment'}
                />
              </div>
            )}

            <div className="flex justify-center mt-5">
              {isGuestCheckout && paymentMethodSelected != 'cod' ? (
                <button
                  onClick={() => window.open('https://www.m.me/starpackph', '_blank')}
                  variant="contained"
                  className="flex flex-row items-center bg-color10c text-white px-6 py-2 rounded hover:bg-color10a"
                >
                  <HiChatBubbleLeftEllipsis />
                  <Typography sx={{ marginLeft: 1 }}>Upload Proof Of Payment</Typography>
                </button>
              ) : (
                <button
                  // onClick={() => {
                  //   navigateTo('/orderChat', {
                  //     state: {
                  //       orderReference: referenceNumber,
                  //       isInquiry: false,
                  //       backButtonRedirect: '/myorders/orderList',
                  //     },
                  //   })
                  // }
                  // }
                  onClick={() => window.open('https://www.m.me/starpackph', '_blank')}
                  variant="contained"
                  className="flex flex-row items-center bg-color10c text-white px-6 py-2 rounded hover:bg-color10a"
                >
                  <HiChatBubbleLeftEllipsis />
                  <Typography sx={{ marginLeft: 1 }}>Message us</Typography>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutProofOfPayment;
