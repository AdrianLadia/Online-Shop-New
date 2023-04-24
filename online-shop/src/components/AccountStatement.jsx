import { Typography } from '@mui/material';
import React from 'react';
import AppContext from '../AppContext';
import { useContext, useState, useEffect } from 'react';
import AccountStatementTable from './AccountStatementTable';
import MyOrderCardModal from './MyOrderCardModal';
import dataManipulation from '../../utils/dataManipulation';

const AccountStatement = () => {

  const { orders, payments } = useContext(AppContext);

  const datamanipulation = new dataManipulation();
  const [orderInfoData, setOrderInfoData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    // console.log('orders', orders);
    // console.log('payments', payments);
    try{
    const dataToUse = datamanipulation.accountStatementData(orders, payments);
    setTableData(dataToUse);
    }catch(e){
      console.log(e)
    }
  }, [orders]);

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-colorbackground via-color2 to-color1">
      <Typography variant="h2" className="flex justify-center mt-4 w-10/12">
        Account Statement
      </Typography>
      <div className='flex justify-center mb-8'>
        <AccountStatementTable
          tableData={tableData}
          orders={orders}
          setOrderInfoData={setOrderInfoData}
          setOpen={setOpen}
        />
      </div>

      {orderInfoData ? <MyOrderCardModal order={orderInfoData} open={open} handleClose={handleClose} /> : null}
    </div>
  );
};

export default AccountStatement;
