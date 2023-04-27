import React from 'react';
import ImageUploadButton from './ImageComponents/ImageUploadButton';
import cloudFirestoreDb from '../cloudFirestoreDb';
import { Typography } from '@mui/material';

const CheckoutProofOfPayment = (props, grandTotal, orders) => {
  const cloudfirestore = new cloudFirestoreDb();
  const paymentMethod = props.paymentMethod;
  const orderData = props.orderData;

  function onUpload(url) {
    cloudfirestore.updateOrderProofOfPaymentLink(reference, userId, url);
  }

  return (
    <div>
      <div className='flex justify-center'>
        <Typography variant='h3'>Thank you for ordering</Typography>
      </div>
      <div className='flex justify-center'>
        <Typography variant='h4'>In order for us to deliver your order</Typography>
      </div>
      
      <div className="flex justify-center">
        <ImageUploadButton buttonTitle={'UPLOAD PROOF OF PAYMENT'} />
      </div>
    </div>
  );
};

export default CheckoutProofOfPayment;
