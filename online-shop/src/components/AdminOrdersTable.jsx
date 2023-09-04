import React, { useEffect, useContext } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link, Typography } from '@mui/material';
import dataManipulation from '../../utils/dataManipulation';
import AppContext from '../AppContext';
import { de } from 'date-fns/locale';

const AdminOrdersTable = (props) => {
  const datamanipulation = new dataManipulation();
  const { userdata } = useContext(AppContext);
  function createData(
    referenceNumber,
    orderDate,
    deliveryDate,
    customerName,
    paid,
    delivered,
    grandTotal,
    address,
    phonenumber,
    name,
    deliveryAddressLatitude,
    deliveryAddressLongitude,
    cart,
    withInvoice,
    deliveryNotes,
  ) {
    return {
      referenceNumber,
      orderDate,
      deliveryDate,
      customerName,
      paid,
      delivered,
      grandTotal,
      address,
      phonenumber,
      name,
      deliveryAddressLatitude,
      deliveryAddressLongitude,
      cart,
      withInvoice,
      deliveryNotes,
    };
  }

  const orders = props.orders;
  const setSelectedOrderReference = props.setSelectedOrderReference;
  const handleOpenModal = props.handleOpenModal;
  const rolesThatAllowTotalToBeSeen = ['admin', 'superAdmin'];

  const [rows, setRows] = React.useState([]);

  useEffect(() => {
    const localrows = [];
    orders.map((order) => {
      console.log(order.countOfOrdersThisYear)

      let withInvoice = null
      if ([0,1].includes(order.countOfOrdersThisYear)) {
        withInvoice = 'Yes'
      }
      else {
        withInvoice = 'No'
      }

      let deliveryDate
      if (order.deliveryDate) {
        deliveryDate = datamanipulation.convertTimestampToDateStringWithoutTime(order.deliveryDate)
      }
      else {
        deliveryDate = ''
      }

      localrows.push(
        createData(
          order.reference,
          datamanipulation.convertDateTimeStampToDateString(order.orderDate),
          deliveryDate,
          order.userName,
          order.paid ? 'YES' : 'NO',
          order.delivered ? 'YES' : 'NO',
          order.grandTotal,
          order.deliveryAddress,
          order.contactPhoneNumber,
          order.contactName,
          order.deliveryAddressLatitude,
          order.deliveryAddressLongitude,
          order.cart,
          withInvoice,
          order.deliveryNotes
        )
      );
    });

    setRows(localrows);
  }, [orders]);

  function handleRowClick(referenceNumber) {
    setSelectedOrderReference(referenceNumber);
  }

  return (
    <TableContainer component={Paper} sx={{ height: '80vh' }}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow className="bg-color10c border-b-2 border-color60">
            <TableCell>Reference #</TableCell>
            <TableCell align="right">Order Date</TableCell>
            <TableCell align="right">Delivery Date</TableCell>
            <TableCell align="right">Customer Name</TableCell>
            <TableCell align="right">Paid</TableCell>
            <TableCell align="right">Delivered</TableCell>
            {rolesThatAllowTotalToBeSeen.includes(userdata.userRole) ? (
              <TableCell align="right">Total</TableCell>
            ) : null}
            <TableCell align="right">Delivery Address</TableCell>
            <TableCell align="right">Phone Number</TableCell>
            <TableCell align="right">Contact Name</TableCell>
            <TableCell align="right">With Invoice</TableCell>
            <TableCell align="right">Delivery Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const deliveredColor = row.delivered === 'YES' ? 'green' : 'red';
            const paidColor = row.paid === 'YES' ? 'green' : 'red';
            return (
              <TableRow
                key={row.referenceNumber}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                onClick={() => {
                  handleRowClick(row.referenceNumber);
                }}
              >
                {/* {referenceNumber, orderDate, customerName, paid, delivered, total, address, phonenumber, name} */}
                <div className="cursor-pointer">
                  <TableCell component="th" scope="row">
                    <Link>{row.referenceNumber}</Link>
                  </TableCell>
                </div>

                <TableCell align="right">{row.orderDate}</TableCell>
                <TableCell align="right">{row.deliveryDate}</TableCell>
                <TableCell align="right">{row.customerName}</TableCell>
                <TableCell align="right">
                  <Typography variant="h7" color={paidColor}>
                    {row.paid}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h7" color={deliveredColor}>
                    {row.delivered}
                  </Typography>
                </TableCell>
                {rolesThatAllowTotalToBeSeen.includes(userdata.userRole) ? (
                <TableCell align="right">{row.grandTotal}</TableCell>
            ) : null}
                <TableCell align="right">
                  <div className="cursor-pointer">
                    <Link
                      onClick={() => {
                        window.open(
                          'https://www.google.com/maps?q=' +
                            row.deliveryAddressLatitude +
                            ',' +
                            row.deliveryAddressLongitude,
                          '_blank'
                        );
                      }}
                    >
                      {row.address}
                    </Link>
                  </div>
                </TableCell>
                <TableCell align="right">{row.phonenumber}</TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.withInvoice}</TableCell>
                <TableCell align="right">{row.deliveryNotes}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminOrdersTable;
