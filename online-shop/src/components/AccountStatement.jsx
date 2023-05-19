import { Typography } from '@mui/material';
import React from 'react';
import AppContext from '../AppContext';
import { useContext, useState, useEffect } from 'react';
import AccountStatementTable from './AccountStatementTable';
import MyOrderCardModal from './MyOrderCardModal';
import dataManipulation from '../../utils/dataManipulation';
import { useNavigate } from 'react-router-dom';
import { BsBookHalf } from 'react-icons/bs';
import UseWindowDimensions from './useWindowDimensions';

const AccountStatement = () => {
  const { orders, payments, userdata } = useContext(AppContext);
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
  const { width } = UseWindowDimensions();

  if (userdata == null) {
    return
  }
  const fullName = userdata.name;
  let firstName = fullName.split(' ')[0];
  let lastName = fullName.split(' ')[1];
  if (firstName === undefined) {
    firstName = '';
  }
  if (lastName === undefined) {
    lastName = '';
  }

  const [remainingBalance, setRemainingBalance] = useState(0);



  useEffect(() => {
    try {
      const dataToUse = datamanipulation.accountStatementData(orders, payments);
      const remainingBalance = (dataToUse[dataToUse.length - 1])[4]
      setRemainingBalance(remainingBalance)

      setTableData(dataToUse);
    } catch (e) {
      console.log(e);
    }
  }, [orders]);

  useEffect(() => {
    let total = 0;
    orders.map((s) => {
      total += s.grandTotal;
    });
    if (total > 0) {
      setOpenButton(true);
      setTotal(total);
    }
  }, [orders]);

  useEffect(() => {
    setButtonClicked(true);
  }, [buttonClicked]);

  function onPayButtonClick() {
    if (buttonClicked) {
      navigateTo(
        '/AccountStatementPayment',
        {state : {
          firstName: firstName,
          lastName: lastName,
          eMail: userdata.email,
          phoneNumber: userdata.phoneNumber,
          totalPrice: remainingBalance,
          userId: userdata.uid,
        }}
      );
    }
  }

  function responsiveVariant() {
    if (width < 366) {
      return 'h3';
    } else {
      return 'h2';
    }
  }

  return (
    <div className="overflow-x-hidden flex flex-col justify-center items-center bg-gradient-to-r from-colorbackground via-color2 to-color1">
      <div className="flex ml-5 mt-10 w-11/12 md:flex-row flex-row-reverse justify-center">
        <Typography variant={responsiveVariant()} className=" flex justify-center ">
          Account Statement
        </Typography>
        <BsBookHalf size={22} />
      </div>
      <div className="flex flex-col w-full 2xs:w-11/12 justify-center my-4 xs:my-8">
        <AccountStatementTable
          tableData={tableData}
          orders={orders}
          setOrderInfoData={setOrderInfoData}
          setOpen={setOpen}
        />
        <div className="flex justify-end mt-4">
          {openButton ? (
            <button
              className="flex self-center w-1/2 xs:w-1/3 justify-center p-2 mr-2 text-white text-lg font-semibold rounded-lg bg-blue1 hover:bg-color10b"
              onClick={onPayButtonClick}
            >
              Pay   ({'₱' + ' ' + remainingBalance})
            </button>
          ) : null}
        </div>
      </div>

      {orderInfoData ? <MyOrderCardModal order={orderInfoData} open={open} handleClose={handleClose} /> : null}
    </div>
  );
};

export default AccountStatement;
