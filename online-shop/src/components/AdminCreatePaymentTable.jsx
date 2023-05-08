import React, {useContext, useEffect, useState} from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, setRef } from '@mui/material';
import AppContext from '../AppContext';
import { CoPresentOutlined } from '@mui/icons-material';

const AdminCreatePaymentTable = () => {

    const { firestore, selectedChatOrderId, setSelectedChatOrderId } = useContext(AppContext);
    const [ paymentsData, setPaymentsData ] = useState([]);
    const [ reference, setReference ] = useState('');
    const [ status, setStatus ] = useState('');

    async function readPayments(){
        firestore.readPayments().then((payment)=>{
            const paymentData = []
            payment.forEach((data)=>{
                const link = data.proofOfPaymentLink;
                const reference = data.orderReference;
                const userId = data.userId;

                if(data.status === 'pending'){
                    paymentData.push({link:link, reference:reference, userId:userId})
                }
            })
            setPaymentsData(paymentData)
        })
    }

    const handleNewTab = (link) => {
      window.open(link, '_blank');
    };

    useEffect(()=>{
        readPayments()
        console.log(status)
        if(reference != "" && status != ""){
            firestore.updatePaymentStatus(reference, status)
              alert("Reference: " + reference + " is " + status)
        }
    },[selectedChatOrderId])

    async function updatePaymentStatus(reference, status){
        setSelectedChatOrderId(reference)
        setStatus(status)
        setReference(reference)
    }

  return (
    <div>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 900, minHeight: 150 }} className='border border-color60' size="small" aria-label="a dense table">
        <TableHead>
          <TableRow className='bg-color60 border-2 border-color60'>
            <TableCell align="left" className='text-white'>Proof of Payment</TableCell>
            <TableCell align="right" className='text-white'>Reference #</TableCell>
            <TableCell align="right" className='text-white'>Customer ID</TableCell>
            <TableCell align="center" className='text-white'>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
           {paymentsData.map((data) => (
            <TableRow >
                <TableCell className="text-7xl w-60">
                    <img onClick={() => handleNewTab(data.link)} src={data.link} className='h-60 w-60 rounded-xl'/>
                </TableCell>
                <TableCell align="right">{data.reference}</TableCell>
                <TableCell align="right">{data.userId}</TableCell>
                <TableCell align="right" >
                    <div className='flex justify-center gap-2 xs:gap-7'>
                      <button className=' border border-red-400 hover:bg-red-100 text-red-400 px-4 py-3 rounded-xl'
                        onClick={() => updatePaymentStatus(data.reference, 'declined')}
                        >Deny
                      </button>
                      <button className='bg-blue1 hover:bg-color10b border border-blue1 text-white px-4 py-3 rounded-xl'
                        onClick={() => updatePaymentStatus(data.reference, 'approved')}
                        >Approve
                      </button>
                    </div>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  )
}

export default AdminCreatePaymentTable