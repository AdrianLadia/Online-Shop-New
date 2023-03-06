import { Typography } from "@mui/material";
import React from "react";
import AppContext from "../AppContext";
import { useContext, useState, useEffect } from "react";
import AccountStatementTable from "./AccountStatementTable";
import MyOrderCardModal from "./MyOrderCardModal";

const AccountStatement = () => {
  const [
    userdata,
    setUserData,
    isadmin,
    db,
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

  const [orderInfoData, setOrderInfoData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const data = [];
    console.log(orders);
    if (orders) {
      orders.map((order) => {
        let newObject = { ...order };
        let value = newObject["orderdate"];
        delete newObject["orderdate"];
        newObject["date"] = value;
        data.push(newObject);
      });
    }

    if (payments) {
      payments.map((payment) => {
        data.push(payment);
      });
    }

    data.sort((a, b) => {
      return b.date.toDate() - a.date.toDate();
    });

    data.reverse();

    const dataToUse = [];
    data.map((item) => {
      if (item.paymentprovider) {
        // console.log(item.date.toDate().toLocaleDateString())
        // console.log(item.paymentprovider + ' ' + item.reference)

        // console.log(item.amount)
        // console.log(item.reference)

        dataToUse.push([
          item.date.toDate().toLocaleDateString(),
          item.paymentprovider + " " + item.reference,
          "",
          parseFloat(item.amount),
        ]);
      } else {
        // console.log(item.date.toDate().toLocaleDateString())
        // console.log(item.reference)
        // console.log(item.grandtotal)
        // console.log(item.reference)

        dataToUse.push([
          item.date.toDate().toLocaleDateString(),
          item.reference,
          item.grandtotal,
          "",
        ]);
      }
    });

    let runningBalance = 0;
    dataToUse.map((item) => {
      runningBalance += item[2];
      runningBalance -= item[3];
      item.push(Math.round(runningBalance * 100) / 100);
      if (runningBalance > 0) {
        item.push("red");}
      else {
        item.push("green")
      }
    });

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
      {/* {orderInfoData !== [] ? 
      <MyOrderCardModal order={orderInfoData} open={open} handleClose={handleClose} />
     
      : null} */}
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
