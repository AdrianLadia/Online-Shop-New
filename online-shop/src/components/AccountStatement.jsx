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
    console.log('orders', orders);
    console.log('payments', payments);
    const dataToUse = datamanipulation.accountStatementData(orders, payments);

    setTableData(dataToUse);

  }, [orders]);

  return (
    <div className="flex flex-col">
      <Typography variant="h4" className="flex justify-center">
        Account Statement
      </Typography>
      <div>
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
