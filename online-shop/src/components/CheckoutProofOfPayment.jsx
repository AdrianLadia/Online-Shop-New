import React from 'react';
import { useContext } from 'react';
import ImageUploadButton from './ImageComponents/ImageUploadButton';
import cloudFirestoreDb from '../cloudFirestoreDb';
import { Divider, Typography } from '@mui/material';
import CheckoutSummary from './CheckoutSummary';
import CheckoutContext from '../context/CheckoutContext';
import { Link } from 'react-router-dom';
import LoginButton from './LoginButton';
import AppContext from '../AppContext';

const CheckoutProofOfPayment = () => {
  // const cloudfirestore = new cloudFirestoreDb();

  const {storage,cloudfirestore,userId} = useContext(AppContext)

  const {
    bdoselected,
    setBdoselected,
    unionbankselected,
    setUnionbankselected,
    gcashselected,
    setGcashselected,
    mayaselected,
    setMayaselected,
    visaselected,
    setVisaselected,
    mastercardselected,
    setMastercardselected,
    bitcoinselected,
    setBitcoinselected,
    ethereumselected,
    setEthereumselected,
    solanaselected,
    setSolanaselected,
    rows,
    setRows,
    total,
    setTotal,
    totalWeight,
    setTotalWeight,
    vat,
    setVat,
    deliveryFee,
    setDeliveryFee,
    grandTotal,
    setGrandTotal,
    area,
    setArea,
    referenceNumber,
  } = useContext(CheckoutContext);

  console.log('rows', rows);

  const bankName = 'BDO';
  const accountName = 'ADRIAN LADIA';
  const accountNumber = '006080021403';

  function onUpload(url) {
    cloudfirestore.updateOrderProofOfPaymentLink(referenceNumber, userId, url);
  }

  return (
    <div>
      {rows == null ? (
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
            <h3 className="text-2xl mb-4">Reference # : {referenceNumber}</h3>

            <p>Please send your payment to the following bank account:</p>
            <div className="bg-gray-200 rounded p-4 my-4">
              <Typography>Bank Name: {bankName}</Typography>
              <Typography>Account Name: {accountName}</Typography>
              <Typography>Account Number: {accountNumber}</Typography>
            </div>
            <p>Once you have completed the payment, please submit proof of payment using the button below.</p>

            <Divider className="mt-5"></Divider>
            {/* <CheckoutSummary/> */}
            <CheckoutSummary
              total={total}
              deliveryFee={deliveryFee}
              grandTotal={grandTotal}
              vat={vat}
              rows={rows}
              area={area}
            />
            <div className="flex justify-center mt-6">
              <ImageUploadButton onUploadFunction={onUpload} storage={storage} folderName={'Orders/' + userId + '/' + referenceNumber}  buttonTitle={'Upload Proof Of Payment'} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutProofOfPayment;
