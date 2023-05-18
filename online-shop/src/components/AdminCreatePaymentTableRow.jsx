import React from 'react';
import { TableRow, TableCell } from '@mui/material';
import { useState } from 'react';

const AdminCreatePaymentTableRow = (props) => {
  const proofOfPaymentLink = props.proofOfPaymentLink;
  const orderReference = props.orderReference;
  const userId = props.userId;
  const userName = props.userName;
  const [amount, setAmount] = useState('');

  const handleNewTab = (link) => {
    window.open(link, '_blank');
  };

  async function updatePaymentStatus() {
    console.log(amount)
    // const data = {
    //   userId: userId,
    //   amount: amount,
    //   reference: orderReference,
    //   paymentprovider: 'TEST',
    //   proofOfPaymentLink: proofOfPaymentLink,
    // };
    // cloudfirestore.transactionCreatePayment(data);
    // alert('Reference: ' + reference + ' is ' + status + a);
    setAmount('');
  }

  console.log(amount);

  return (
    <TableRow>
      <TableCell className="text-7xl w-60">
        <img
          onClick={() => handleNewTab(proofOfPaymentLink)}
          src={proofOfPaymentLink}
          className="h-60 w-60 rounded-xl"
        />
      </TableCell>
      <TableCell align="right">{orderReference}</TableCell>
      <TableCell align="right">{userId}</TableCell>
      <TableCell align="right">
        <div className="flex justify-evenly gap-2 xs:gap-3">
          <button
            className=" border border-red-400 hover:bg-red-50 text-red-400 px-4 py-3 rounded-xl"
            // onClick={() => data.link === data.link? (deleteDeclinedProofOfPaymentLink(data.reference, 'declined',data.userId, data.link)) : null}
            onClick={() => deleteDeclinedProofOfPaymentLink(data.reference, data.userId, data.link)}
          >
            Deny
          </button>
          <button
            className="bg-blue1 hover:bg-color10b border border-blue1 text-white px-4 py-3 rounded-xl"
            onClick={updatePaymentStatus}
          >
            Approve
          </button>
        </div>
      </TableCell>
      <TableCell align="center">
        <div className="flex justify-center">
          <input
            className="border-2 border-color60 hover:border-color10c focus:border-color10c outline-none rounded-xl
                                placeholder:text-color60 placeholder:focus:text-color10c text-color60 
                                  w-3/4 p-3 "
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
