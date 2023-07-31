import React from 'react';
import { TableRow, TableCell } from '@mui/material';
import { useState, useContext } from 'react';
import AppContext from '../AppContext';
import CircularProgress from '@mui/material/CircularProgress';

const AdminCreatePaymentTableRow = (props) => {
  const proofOfPaymentLink = props.proofOfPaymentLink;
  const orderReference = props.orderReference;
  const userId = props.userId;
  const userName = props.userName;
  const setPaymentsData = props.setPaymentsData;
  const [amount, setAmount] = useState('');
  const { cloudfirestore, firestore } = useContext(AppContext);
  const paymentsData = props.paymentsData;
  const paymentMethod = props.paymentMethod;
  const [loading, setLoading] = useState(false);
  

  const handleNewTab = (link) => {
    window.open(link, '_blank');
  };

  async function updatePaymentStatus(status) {
    setLoading(true);
    if (status === 'approved') {

      if (amount === '') {
        alert('Please enter amount');
        setLoading(false);
        return;
      }

      const data = {
        userId: userId,
        amount: amount,
        reference: orderReference,
        paymentprovider: paymentMethod,
        proofOfPaymentLink: proofOfPaymentLink,
        affiliateUserId : 'm3XqOfwYVchb1jwe9Jpat5ZrzJYJ'
      };
      await cloudfirestore.transactionCreatePayment(data);
      const customerEmail = await firestore.readEmailAddressByUserId(userId);
  
      await cloudfirestore.sendEmail({
        to: customerEmail,
        subject: 'Payment Accepted',
        text: `Your payment of PHP ${amount} has been accepted. Thank you for shopping with us!`,
      });
      alert('Reference: ' + data.reference + ' is ' + status);
      setLoading(false);
      setAmount('');
    }
    if (status === 'declined') {
      await firestore.deleteDeclinedPayment(orderReference, userId, proofOfPaymentLink);
      const customerEmail = await firestore.readEmailAddressByUserId(userId);
     
      cloudfirestore.sendEmail({
        to: customerEmail,
        subject: 'Payment Denied',
        text: 'Your payment has been denied. For customer support please go to our website www.starpack.ph... Chat us in My Orders - Message',
      });

      setLoading(false);
    }

    const newPaymentsData = paymentsData.filter((data) => data.link != proofOfPaymentLink);
    setPaymentsData(newPaymentsData);
  }

  


  return (
    <TableRow>
      <TableCell>
        <img
          onClick={() => handleNewTab(proofOfPaymentLink)}
          src={proofOfPaymentLink}
          className="rounded-xl cursor-pointer"
        />
      </TableCell>
      <TableCell align="right">{orderReference}</TableCell>
      <TableCell align="right">{userId}</TableCell>
      <TableCell align="right">{userName}</TableCell>
      <TableCell align="right">{paymentMethod}</TableCell>
      <TableCell align="right">
        <div className="flex justify-evenly gap-2 xs:gap-3">
          <button
            className=" border border-red-400 hover:bg-red-50 text-red-400 px-4 py-3 rounded-xl"
            // onClick={() => data.link === data.link? (deleteDeclinedProofOfPaymentLink(data.reference, 'declined',data.userId, data.link)) : null}
            onClick={() => updatePaymentStatus('declined')}
          >
            {loading ? <CircularProgress/> : <>Deny</> }
          </button>
          <button
            className="bg-blue1 hover:bg-color10b border border-blue1 text-white px-4 py-3 rounded-xl"
            onClick={() => updatePaymentStatus('approved')}
          >
            {loading ? <CircularProgress/> : <>Approve</> }
          </button>
        </div>
      </TableCell>
      <TableCell align="center">
        <div className="flex justify-center">
          <input
            className="border-2 border-color60 hover:border-color10c focus:border-color10c outline-none rounded-xl
                                placeholder:text-color60 placeholder:focus:text-color10c text-color60 
                                  w-28 p-3 "
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default AdminCreatePaymentTableRow;
