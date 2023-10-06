import React, { useEffect,useContext } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link, Typography } from '@mui/material';
import { format, utcToZonedTime } from 'date-fns-tz';
import dataManipulation from '../../utils/dataManipulation';
import AppContext from '../AppContext';

const AccountStatementTable = (props) => {
  const tableData = props.tableData;
  const [rows, setRows] = React.useState([]);
  const orders = props.orders;
  const setOrderInfoData = props.setOrderInfoData;
  const setOpen = props.setOpen;
  const {datamanipulation} = useContext(AppContext);


  useEffect(() => {
    const rowsdata = datamanipulation.accountStatementTable(tableData);

    setRows(rowsdata);
  }, [tableData]);

  function operReferenceNumber(reference,proofOfPaymentLink) {
    if (proofOfPaymentLink) {
      window.open(proofOfPaymentLink, '_blank');
    }
    else {
      const filter = datamanipulation.getOrderFromReference(reference, orders);
      setOrderInfoData(filter);
      setOpen(true);
    }
  }

  return (
    <div className=" my-5 border-2 border-color60 rounded-lg">
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead className="bg-color10c border-b-2 border-color60">
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Reference</TableCell>
              <TableCell align="right">Credit</TableCell>
              <TableCell align="right">Debit</TableCell>
              <TableCell align="right">Running Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>

                <TableCell align="right">
                  <Link
                    href="#"
                    onClick={() => {
                      operReferenceNumber(row.reference,row.proofOfPaymentLink);
                    }}
                  >
                    {row.reference}
                  </Link>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h7" color={'red'}>
                    {row.credit}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h7" color={'green'}>
                    {row.debit}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography variant="h7" color={row.color}>
                    {row.runningBalance}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AccountStatementTable;
