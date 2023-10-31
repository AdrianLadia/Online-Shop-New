import React, { useEffect } from 'react';
import { TableRow, TableCell } from '@mui/material';
import { useState, useContext } from 'react';
import AppContext from '../AppContext';
import CircularProgress from '@mui/material/CircularProgress';


const AdminCreatePaymentTableRow = (props) => {
  const proofOfPaymentLink = props.proofOfPaymentLink;
  const orderReference = props.orderReference;
  const userId = props.userId;
  const userName = props.userName;
  const setOrder = props.setOrder;
  const setOpenModal = props.setOpenModal;
  const setPaymentsData = props.setPaymentsData;
  const [amount, setAmount] = useState('');
  const { cloudfirestore, firestore } = useContext(AppContext);
  const paymentsData = props.paymentsData;
  const paymentMethod = props.paymentMethod;
  const [loading, setLoading] = useState(false);

  // if amount exists, set it to amount state
  // amount exists when guest created an order
  // we automatically add the payment so that it will be more efficient
  useEffect(() => {
    if(props.amount) {
      setAmount(props.amount);
    }
  }, [props.amount]);
  

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
        proofOfPaymentLink: proofOfPaymentLink
      };
      try{
        // console.log('RAN transactionCreatePayment')
        await cloudfirestore.transactionCreatePayment(data);
      }
      catch(error){
        alert('Error creating payment. Please try again.');
        setLoading(false);
        return
      }
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
      try{
        await firestore.deleteDeclinedPayment(orderReference, userId, proofOfPaymentLink);
      }
      catch{
        alert('Error deleting declined payment. Please try again.');
        setLoading(false);
        return
      }
      const customerEmail = await firestore.readEmailAddressByUserId(userId);
     
      cloudfirestore.sendEmail({
        to: customerEmail,
        subject: 'Payment Denied',
        text: 'Your payment has been denied. For customer support please go to our website www.starpack.ph... Chat us in My Orders - Message',
      });

      setLoading(false);
    }

    // const newPaymentsData = paymentsData.filter((data) => data.link != proofOfPaymentLink);
    // setPaymentsData(newPaymentsData);
  }

  async function onReferenceClick() {
    const order = await firestore.readSelectedDataFromCollection('Orders',orderReference)
    console.log('order',order)
    setOrder(order)
    setOpenModal(true)
    
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
      <TableCell align="right"><span onClick={onReferenceClick} class="text-blue-500 underline cursor-pointer">{orderReference}</span> </TableCell>
      <TableCell align="right">{userId}</TableCell>
      <TableCell align="right">{userName}</TableCell>
      <TableCell align="right">{paymentMethod}</TableCell>
      <TableCell align="right">
        <div className="flex justify-evenly gap-2 xs:gap-3">
          <button
            disabled={loading}
            className=" border border-red-400 hover:bg-red-50 text-red-400 px-4 py-3 rounded-xl"
            // onClick={() => data.link === data.link? (deleteDeclinedProofOfPaymentLink(data.reference, 'declined',data.userId, data.link)) : null}
            onClick={() => updatePaymentStatus('declined')}
          >
            {loading ? <CircularProgress size={20} className=' text-red mt-1'/> : <>Deny</> }
          </button>
          <button
            disabled={loading}
            className="bg-blue1 hover:bg-color10b hover:border-color10b border border-blue1 text-white px-4 py-3 rounded-xl"
            onClick={() => updatePaymentStatus('approved')}
          >
            {loading ? <CircularProgress size={20} className='text-white mt-1'/> : <>Approve</> }
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
