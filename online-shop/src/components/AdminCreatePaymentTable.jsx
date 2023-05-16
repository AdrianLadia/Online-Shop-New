import React, { useContext, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, setRef } from '@mui/material';
import AppContext from '../AppContext';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
  runTransaction,
} from "firebase/firestore";

const AdminCreatePaymentTable = () => {
  const { firestore, selectedChatOrderId, setSelectedChatOrderId, cloudfirestore } = useContext(AppContext);
  const [paymentsData, setPaymentsData] = useState([]);
  const [reference, setReference] = useState('');
  const [status, setStatus] = useState('');
  const [link, setLink] = useState([]);
  const [newAmount, setNewAmount] = useState();
  const [amount, setAmount] = useState(null);

  async function readPayments() {
    firestore.readPayments().then((payment) => {

      const paymentData = [];
      const photoLink = [];
      payment.forEach((data) => {
        const link = data.proofOfPaymentLink;
        const reference = data.orderReference;
        const userId = data.userId;
        

        if (data.status === 'pending') {
          paymentData.push({ link: link, reference: reference, userId: userId });
          photoLink.push({link: link})
        }
      });
      setPaymentsData(paymentData);
      setLink(photoLink)
    });
  }

  const handleNewTab = (link) => {
    window.open(link, '_blank');
  };

  useEffect(() => {
    readPayments();
    if (reference != '' && status != '') {
      alert('Reference: ' + reference + ' is ' + status );
    }
  }, [selectedChatOrderId]);

  async function updatePaymentStatus(reference, status, userId) {
    setNewAmount(amount);
    if(amount){
      const a = amount;
      alert('Reference: ' + reference + ' is ' + status + a)
      firestore.updatePaymentStatus(reference, status);
    }
    const data = {
      userId: userId,
      amount: newAmount,
      reference: reference,
      paymentprovider: 'BDO',
    };
      cloudfirestore.transactionCreatePayment(data);
      setSelectedChatOrderId(reference);
      setStatus(status);
      setReference(reference);
      setNewAmount(null);
      setAmount(null)
  }

  async function deleteDeclinedProofOfPaymentLink(reference, userId, link){
    await firestore.deleteDeclinedPayment(reference, userId, link)
  }

  return (
    <div>
      <TableContainer component={Paper}>
        {/* <button onClick={readPayments}>asddy</button> */}
        <Table
          sx={{ minWidth: 1050, minHeight: 150 }}
          className="border border-color60"
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow className="bg-color60 border-2 border-color60">
              <TableCell align="left" className="text-white">
                Proof of Payment
              </TableCell>
              <TableCell align="right" className="text-white">
                Reference #
              </TableCell>
              <TableCell align="right" className="text-white">
                Customer ID
              </TableCell>
              <TableCell align="center" className="text-white">
                Actions
              </TableCell>
              <TableCell align="center" className="text-white">
                Amount Paid
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentsData.map((data) => (
              <TableRow>
                <TableCell className="text-7xl w-60">
                  <img onClick={() => handleNewTab(data.link)} src={data.link} className="h-60 w-60 rounded-xl" />
                </TableCell>
                <TableCell align="right">{data.reference}</TableCell>
                <TableCell align="right">{data.userId}</TableCell>
                <TableCell align="right">
                  <div className="flex justify-evenly gap-2 xs:gap-3">
                    <button
                      className=" border border-red-400 hover:bg-red-50 text-red-400 px-4 py-3 rounded-xl"
                      // onClick={() => data.link === data.link? (deleteDeclinedProofOfPaymentLink(data.reference, 'declined',data.userId, data.link)) : null}
                      onClick={() => data.link === data.link? (deleteDeclinedProofOfPaymentLink(data.reference, data.userId, data.link)) : null}
                    >
                      Deny
                    </button>
                    <button
                      className="bg-blue1 hover:bg-color10b border border-blue1 text-white px-4 py-3 rounded-xl"
                      onClick={() => data.link === data.link? (updatePaymentStatus(data.reference, 'approved',data.userId, data.link)) : null}
                    >
                      Approve
                    </button>
                  </div>
                </TableCell>
                <TableCell align="center">
                  <div className='flex justify-center'>
                    <input 
                      className='border-2 border-color60 hover:border-color10c focus:border-color10c outline-none rounded-xl
                                placeholder:text-color60 placeholder:focus:text-color10c text-color60 
                                  w-3/4 p-3 '
                      placeholder='Amount'
                      type='number'
                      value={newAmount}
                      onChange={(event) => setAmount(event.target.value)}
                      />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminCreatePaymentTable;
