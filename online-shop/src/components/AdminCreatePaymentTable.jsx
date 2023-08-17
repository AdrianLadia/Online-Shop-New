import React, { useContext, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, setRef } from '@mui/material';
import AppContext from '../AppContext';
import AdminCreatePaymentTableRow from './AdminCreatePaymentTableRow';
import { collection,where,query,onSnapshot } from 'firebase/firestore';

const AdminCreatePaymentTable = () => {
  const { firestore, selectedChatOrderId, setSelectedChatOrderId, cloudfirestore,db } = useContext(AppContext);
  const [paymentsData, setPaymentsData] = useState([]);
  const [reference, setReference] = useState('');
  const [status, setStatus] = useState('');
  const [link, setLink] = useState([]);
  const [amount, setAmount] = useState(null);

  // async function readPayments() {

  //   firestore.readPayments().then((payment) => {

  //     const paymentData = [];
  //     const photoLink = [];
  //     payment.forEach((data) => {
  //       const link = data.proofOfPaymentLink;
  //       const reference = data.orderReference;
  //       const userId = data.userId;
  //       const userName = data.userName
  //       const paymentMethod = data.paymentMethod;
        

  //       if (data.status === 'pending') {
  //         paymentData.push({ link: link, reference: reference, userId: userId,userName:userName, paymentMethod: paymentMethod });
  //         photoLink.push({link: link})
  //       }
  //     });
  //     setPaymentsData(paymentData);
  //     setLink(photoLink)
     
  //   });
  // }


  useEffect(() => {
    // if (paymentsData == []) {
      const docRef = collection(db, 'Payments');
      const q = query(docRef, where('status', '==', 'pending'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const pendingPayments = [];
        const photoLink = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const link = data.proofOfPaymentLink;
          const reference = data.orderReference;
          const userId = data.userId;
          const userName = data.userName;
          const paymentMethod = data.paymentMethod;
          const amount = data.amount;
          pendingPayments.push({ link: link, reference: reference, userId: userId, userName: userName, paymentMethod: paymentMethod, amount: amount });
          photoLink.push({ link: link });
        });
        setPaymentsData(pendingPayments);
        setLink([photoLink]);
      });
    // }
    // readPayments();
    if (reference != '' && status != '') {
      alert('Reference: ' + reference + ' is ' + status );
    }

    return () => unsubscribe()
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
              <TableCell align="right" className="text-white">
                Payment Method
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
              <AdminCreatePaymentTableRow paymentsData={paymentsData} setPaymentsData={setPaymentsData} proofOfPaymentLink={data.link} orderReference={data.reference} userId={data.userId} userName={data.userName} paymentMethod={data.paymentMethod}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminCreatePaymentTable;
