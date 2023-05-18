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
import AdminCreatePaymentTableRow from './AdminCreatePaymentTableRow';

const AdminCreatePaymentTable = () => {
  const { firestore, selectedChatOrderId, setSelectedChatOrderId, cloudfirestore } = useContext(AppContext);
  const [paymentsData, setPaymentsData] = useState([]);
  const [reference, setReference] = useState('');
  const [status, setStatus] = useState('');
  const [link, setLink] = useState([]);
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

  

  async function updatePaymentStatus(reference, status, userId,amount,proofOfPaymentLink) {
    const data = {
      userId: userId,
      amount: amount,
      reference: reference,
      paymentprovider: 'BDO',
      proofOfPaymentLink: proofOfPaymentLink,
    };
    cloudfirestore.transactionCreatePayment(data);
    alert('Reference: ' + reference + ' is ' + status + a)  
      setSelectedChatOrderId(reference);
      setStatus(status);
      setReference(reference);
      setAmount(null)
  }

  async function deleteDeclinedProofOfPaymentLink(reference, userId, link){
    await firestore.deleteDeclinedPayment(reference, userId, link)
  }

  console.log(paymentsData)

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
             
              <AdminCreatePaymentTableRow proofOfPaymentLink={data.link} orderReference={data.reference} userId={data.userId}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminCreatePaymentTable;
