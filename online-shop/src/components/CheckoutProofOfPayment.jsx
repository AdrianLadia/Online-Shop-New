import React from 'react';
import { useContext,useState,useEffect } from 'react';
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

const CheckoutProofOfPayment = (props) => {
  // const referenceNumber = props.referenceNumber
  // const cloudfirestore = new cloudFirestoreDb();
  const datamanipulation = new dataManipulation();
  const { storage, cloudfirestore, userId, userdata, firestore } = useContext(AppContext);
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
  } = location.state;
  const orderDateObject = new Date(date);
  const orderExpiryDate = new Date(orderDateObject.getTime() + 86400000);
  const dateNow = new Date();
  const dateDifference = datamanipulation.getSecondsDifferenceBetweentTwoDates(dateNow, orderExpiryDate);
  const navigateTo = useNavigate();
  const [paymentMethods,setPaymentMethods] = useState([])

  useEffect(() => {
      firestore.readAllPaymentProviders().then((providers) => {
    
        setPaymentMethods(providers)
      })
  }, []);

  let bankName;
  let accountName;
  let accountNumber;



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
  if (paymentMethodSelected == 'gcash') {
    bankName = 'GCASH';
    accountName = 'ADRIAN LADIA';
    accountNumber = '0917-892-7206';
  }

  function onUpload(url) {
    const timestamp = Timestamp.fromDate(date);
    const timestampString = timestamp.toDate().toLocaleString();

    cloudfirestore.updateOrderProofOfPaymentLink(referenceNumber, userId, url, userdata.name, bankName);
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
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Thank you for your order!</h2>
            {referenceNumber != '' ? <h3 className="text-2xl mb-4">Reference # : {referenceNumber}</h3> : null}

            <p>Please send your payment to the following bank account:</p>
            <div className="bg-gray-200 rounded p-4 my-4">
              <Typography>Bank Name: {bankName}</Typography>
              <Typography>Account Name: {accountName}</Typography>
              <Typography>Account Number: {accountNumber}</Typography>
            </div>
            <p>Once you have completed the payment, please submit proof of payment using the button below.</p>

            <Divider className="mt-5"></Divider>
            {/* <CheckoutSummary/> */}
            {rows != null ? (
              <CheckoutSummary
                total={itemsTotal}
                deliveryFee={deliveryFee}
                grandTotal={grandTotal}
                vat={vat}
                rows={rows}
                area={area}
              />
            ) : (
              <div className="flex justify-center mt-5">
                <Typography>{`Total : ₱ ${grandTotal}`}</Typography>
              </div>
            )}

            <div className="flex flex-col justify-center">
              <div className="flex flex-row justify-center">
                <Typography variant="h7" color={'#6bd0ff'} sx={{ marginRight: 1 }}>
                  Order will expire in :
                </Typography>
                <CountdownTimer initialTime={dateDifference} />
              </div>
              <div className="flex justify-center mt-2">
                <Typography variant="h7" color={'#6bd0ff'} sx={{ marginRight: 1 }}>
                  Please upload your proof of payment within 24 hours.
                </Typography>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <ImageUploadButton
                onUploadFunction={onUpload}
                storage={storage}
                folderName={'Orders/' + userId + '/' + referenceNumber}
                buttonTitle={'Upload Proof Of Payment'}
              />
            </div>
            <div className="flex justify-center mt-5">
              <Button
                onClick={() => navigateTo('/orderChat', { state: { orderReference: referenceNumber } })}
                variant="contained"
                color="success"
              >
                <HiChatBubbleLeftEllipsis />
                <Typography sx={{marginLeft:1}} >Message us</Typography>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutProofOfPayment;
