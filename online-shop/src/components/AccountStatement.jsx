import { Typography } from '@mui/material';
import React from 'react';
import AppContext from '../AppContext';
import { useContext, useState, useEffect } from 'react';
import AccountStatementTable from './AccountStatementTable';
import MyOrderCardModal from './MyOrderCardModal';
import dataManipulation from '../../utils/dataManipulation';
import { useNavigate } from 'react-router-dom';

const AccountStatement = () => {

  const { orders, payments } = useContext(AppContext);
  const navigateTo = useNavigate();
  const datamanipulation = new dataManipulation();
  const [orderInfoData, setOrderInfoData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // const {goToCheckoutPage, setGoToCheckoutPage } = useContext(AppContext);
  const [openButton, setOpenButton] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    try{
    const dataToUse = datamanipulation.accountStatementData(orders, payments);
    setTableData(dataToUse);
    }catch(e){
      console.log(e)
    }
  }, [orders]);

  useEffect(()=>{
    let total = 0;
    orders.map((s)=>{
      total += s.grandTotal;
    })
    if(total > 0 ){
      setOpenButton(true)
      setTotal(total)
    }
  },[orders])

  useEffect(()=>{
    setButtonClicked(true)
  },[buttonClicked])

  function onClicks(){
    if(buttonClicked ){
      navigateTo("/AccountStatementPayment")
    }
  }

  // function totalButton(){
  //   return <a className='text-orange-500'>{' ' + '₱' + ' ' +  total}</a>
  // }

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-colorbackground via-color2 to-color1">
      <Typography variant="h2" className="  flex justify-center mt-4 w-10/12">
        Account Statement
      </Typography>
      <div className='flex flex-col w-10/12 justify-center mb-8'>
        <AccountStatementTable
          tableData={tableData}
          orders={orders}
          setOrderInfoData={setOrderInfoData}
          setOpen={setOpen}
        />
        <div className='flex justify-end w-11/12 mt-4'>
          {openButton?(
            <button 
              className='flex self-center w-1/3 justify-center mr-2 p-2 text-white text-lg font-semibold rounded-lg bg-blue1 hover:bg-color10b'
              onClick={onClicks}
              >Pay   ({'₱' + ' ' +   total})
            </button>
            ):(null)
          }
        </div>
      </div>

      {orderInfoData ? <MyOrderCardModal order={orderInfoData} open={open} handleClose={handleClose} /> : null}
    </div>
  );
};

export default AccountStatement;
