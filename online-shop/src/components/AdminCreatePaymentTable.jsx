import React, {useContext, useEffect, useState} from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AppContext from '../AppContext';
import { BsFillImageFill,  } from "react-icons/bs";


const AdminCreatePaymentTable = () => {

    const { firestore } = useContext(AppContext);
    const [ paymentsData, setPaymentsData ] = useState([]);
    

    async function readPayments(){
        firestore.readPayments().then((payment)=>{
            const paymentData = []
            payment.forEach((data)=>{
                const link = data.proofOfPaymentLink;
                const reference = data.reference;
                const userId = data.userId;

                paymentData.push({link:link, reference:reference, userId:userId})
            })
            setPaymentsData(paymentData)
        })
    }

  return (
    <div>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650, minHeight: 150 }} className='border border-color60' size="small" aria-label="a dense table">
        <TableHead>
          <TableRow className='bg-color60 border border-color60'>
            <TableCell align="left" className='text-white'>Proof of Payment</TableCell>
            <TableCell align="right" className='text-white'>Reference #</TableCell>
            <TableCell align="right" className='text-white'>Customer ID</TableCell>
            <TableCell align="right" className='text-white'>Payment Method</TableCell>
            <TableCell align="center" className='text-white'>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
           {paymentsData.map((data) => (
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0} }}>
              <TableCell component="th" scope="row" className="text-7xl"><BsFillImageFill/></TableCell>
              <TableCell align="right">{data.link}</TableCell>
              <TableCell align="right">{data.reference}1</TableCell>
              <TableCell align="right">{data.userId}</TableCell>
              <TableCell align="right" >
                <div className='flex justify-evenly gap-2 '>
                  <button 
                    className=' border border-red-400 hover:bg-red-100 text-red-400 px-4 py-3 rounded-xl'
                    onClick={readPayments}
                    >Deny
                  </button>

                  <button 
                    className='bg-color60 hover:bg-color10c text-white px-4 py-3 rounded-xl'
                    >Approve
                  </button>
                </div>
              </TableCell>
            </TableRow>
           ))}
        </TableBody>
      </Table>
    </TableContainer>+
    </div>
  )
}

export default AdminCreatePaymentTable