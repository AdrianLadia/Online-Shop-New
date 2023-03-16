import { Typography } from "@mui/material";
import React from "react";
import AppContext from "../AppContext";
import { useContext, useState, useEffect } from "react";
import AccountStatementTable from "./AccountStatementTable";
import MyOrderCardModal from "./MyOrderCardModal";
import dataManipulation from "../../utils/dataManipulation";


const AccountStatement = () => {
  const [
    userdata,
    setUserData,
    isadmin,
    firestore,
    cart,
    setCart,
    favoriteitems,
    setFavoriteItems,
    userId,
    setUserId,
    refreshUser,
    setRefreshUser,
    userLoaded,
    setUserLoaded,
    deliveryaddress,
    setDeliveryAddress,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    userstate,
    setUserState,
    phonenumber,
    setPhoneNumber,
    orders,
    setOrders,
    payments,
    setPayments,
  ] = useContext(AppContext);

  const datamanipulation = new dataManipulation();
  const [orderInfoData, setOrderInfoData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const dataToUse = datamanipulation.accountStatementData(orders,payments)


    console.log(dataToUse)
    setTableData(dataToUse);

    // console.log(data)
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

      {orderInfoData ? (
        <MyOrderCardModal
          order={orderInfoData}
          open={open}
          handleClose={handleClose}
        />
      ) : null}
    </div>
  );
};

export default AccountStatement;
