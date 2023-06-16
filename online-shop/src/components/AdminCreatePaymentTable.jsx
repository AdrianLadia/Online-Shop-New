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
        const userName = data.userName
        

        if (data.status === 'pending') {
          paymentData.push({ link: link, reference: reference, userId: userId,userName:userName });
          photoLink.push({link: link})
        }
      });
      setPaymentsData(paymentData);
      setLink(photoLink)
    });
  }


  useEffect(() => {
    readPayments();
    if (reference != '' && status != '') {
      alert('Reference: ' + reference + ' is ' + status );
    }
  }, [selectedChatOrderId]);

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
              <TableCell align="right" className="text-white">
                Customer Name
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
              <AdminCreatePaymentTableRow paymentsData={paymentsData} setPaymentsData={setPaymentsData} proofOfPaymentLink={data.link} orderReference={data.reference} userId={data.userId} userName={data.userName}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminCreatePaymentTable;
