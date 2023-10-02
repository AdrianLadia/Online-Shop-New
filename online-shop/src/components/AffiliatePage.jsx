import React,{useContext, useEffect, useState} from 'react'
import AppContext from '../AppContext'
import useWindowDimensions from "./UseWindowDimensions";
import Autocomplete from '@mui/material/Autocomplete';
import { TextField, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button } from '@mui/material';
import AffiliateAddPaymentMethodModal from './AffiliateAddPaymentMethodModal';

const AdminAffiliatePage = () => {

    const { userdata, cloudfirestore, refreshUser,firestore,alertSnackbar} = useContext(AppContext);
    const { height} = useWindowDimensions()
    const [paymentMethods, setPaymentMethods] = useState([]);
    
    // affiliate claim Id should be handled by backend
    const affiliateClaimId = [...Array(20)].map(() => Math.random().toString(36)[2]).join('');
    const [chosenMethod, setChosenMethod] = useState(null);
    const [paymentMethodData, setPaymentMethodData] = useState(null);
    const [total, setTotal] = useState(0);
    const accountNumber = '152512'
    const accountName = 'John Doe';
    const currentDate = new Date().toDateString()
    const [openAddPaymentMethodModal, setOpenAddPaymentMethodModal] = useState(false);
    const [loading,setLoading] = useState(true)

    useEffect(() => {
      if (userdata) {
        firestore.readAllAvailableAffiliateBankAccounts(userdata.uid).then(bankAccounts=>{

          setPaymentMethodData(bankAccounts)
         
          const bankNames = []
          bankAccounts.forEach((bank)=>{
            bankNames.push(bank.bank)
          })

          setPaymentMethods(bankNames)
        })
      }
    }, [userdata]);



    function onClaimClick(){
      if(chosenMethod && total > 0 && userdata){
        setLoading(true)
        const data1 = {
          date: new Date().toDateString(),
          data: affiliateCommissions,
          id: userdata.uid,
          claimCode: affiliateClaimId,
        }
        const data2 = {
          affiliateUserId: userdata.uid,
          affiliateClaimId: affiliateClaimId,
          method: chosenMethod,
          accountNumber: accountNumber,
          accountName: accountName,
          transactionDate: currentDate,
          amount: total,
          totalDeposited:0,
          isDone: false
        }
        const data = {
          data1:data1,
          data2:data2
        }
        cloudfirestore.onAffiliateClaim(data).then(res=>{
          if(res.request.status==200){
            alertSnackbar('success',"Your Claim Request is Submitted Successfully.")
            window.location.reload()
            setLoading(false)
          }else{
            alertSnackbar('error',"Something went wrong. Please try again.")
            setLoading(false)
          }
        })
      }
      
    }

    let affiliateCommissions = userdata ? userdata.affiliateCommissions:null;

    useEffect(() => {
      if(userdata){
        const claimables = affiliateCommissions.filter((item)=>item.status == 'claimable')
        let totalUnclaimed = 0
        claimables.forEach((item)=>{
          totalUnclaimed += parseFloat(item.commission)
        })


        setTotal(totalUnclaimed.toFixed(2))
      }
    }, [affiliateCommissions, refreshUser]);

    function disableColor(){
      if(chosenMethod && total != 0){
        return ' bg-color10b hover:bg-blue1'
      }else{
        return ' bg-gray-300 cursor-not-allowed'
      }
    }

    function disableButton(){
      if (chosenMethod && total != 0) {
        return false
      }
      else if (loading == false) {
        return false
      }
      else {
        return true
      }
    }

  return (  
    <div className='flex flex-col justify-center items-center tracking-widest  font-sans'>
      <div className='flex flex-col justify-evenly h-40per w-full p-5 '>
        <div className='flex flex-col gap-1.5 items-center justify-center '>
          <div className='text-color30'>{'Commission'}</div>
          <div className='text-blue1 tracking-wider text-6xl font-semibold p-3.5 px-16 rounded-lg border-t border-x border-color30 shadow-md shadow-color30'>₱ {total}</div>
        </div>
        <div className='flex lg:flex-row flex-col items-center gap-8 justify-center '>
          <div className='flex items-center justify-center mr-5 h-14 '>
          <Button onClick={()=>{setOpenAddPaymentMethodModal(true)}} 
            className={'h-full rounded-lg mb-0.5 '} variant='contained'>Add Payment Method
          </Button>
          </div>
          <div className='h-1/2 items-center w-96 flex bg-red-100'>
            <Autocomplete value={chosenMethod} options={paymentMethods}
              className='w-full' disablePortal id="combo-box-demo"
              onChange={(event, newValue) => { setChosenMethod(newValue) }}
              sx={{ backgroundColor: '#D6EFC7', borderRadius: 2, color: '#bb9541',
                '& .MuiOutlinedInput-notchedOutline': { border: 2, color: '#bb9541', borderRadius: 2, },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { color: '#bb9541', border: 2, },
                '& .MuiOutlinedInput-root:after .MuiOutlinedInput-notchedOutline': { color: '#bb9541', border: 2, },
              }}
              renderInput={(params) => <TextField required {...params} label="Method" />}
            />
          </div>
          <div className='h-full  flex'>
            <Button disabled={ disableButton()} onClick={onClaimClick} 
              className={'tracking-widest px-10 rounded-lg mb-0.5 w-3/12 ' + disableColor()} variant='contained'>Claim
            </Button>
          </div>
        </div>
      </div>
      {userdata?<div className=' h-60per w-full flex justify-center items-start'>
        <div className='h-9/10 w-9/10 rounded-lg '>
          <TableContainer className="border-2 border-color30" component={Paper} sx={{ maxHeight: height - 250 }}>
            <Table style={{ tableLayout: "auto" }} fixedHeader={true} aria-label="simple table">
              <TableHead className="bg-color30 bg-opacity-100 h-16">
                <TableCell className="font-sans text-lg tracking-wider text-white">Customer</TableCell>
                <TableCell className="font-sans text-lg tracking-wider text-white">Date Ordered</TableCell>
                <TableCell className="font-sans text-lg tracking-wider text-white">Status</TableCell>
                <TableCell className="font-sans text-lg tracking-wider text-white">Commission</TableCell>
              </TableHead>
              <TableBody >
                {affiliateCommissions != 0 ? affiliateCommissions.map((data, index)=>(
                  <TableRow key={index}>
                    <TableCell>{data.customer}</TableCell>
                    <TableCell>{data.dateOrdered}</TableCell>
                    <TableCell style={{color:data.status == 'claimable'? 'limegreen':data.status=='claimed'?"#429eff":'orange'}}>{data.status}</TableCell>
                    <TableCell className="text-green-500">₱ {data.commission.toLocaleString()}</TableCell>
                  </TableRow>
                )):'No Commissions'}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>:"login"}
      <AffiliateAddPaymentMethodModal paymentMethodData={paymentMethodData} open={openAddPaymentMethodModal} setOpen={setOpenAddPaymentMethodModal} />
    </div>
  )
}

export default AdminAffiliatePage