import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link, Typography } from "@mui/material";
import { format, utcToZonedTime } from 'date-fns-tz';
import dataManipulation from "../../utils/dataManipulation";


const AccountStatementTable = (props) => {
  

  const tableData = props.tableData;
  const [rows, setRows] = React.useState([]);
  const orders = props.orders;
  const setOrderInfoData = props.setOrderInfoData;
  const setOpen = props.setOpen;
  const datamanipulation = new dataManipulation();

  useEffect(() => {
    const rowsdata = datamanipulation.accountStatementTable(tableData)

    setRows(rowsdata);
  }, [tableData]);

  function openOrderInfoModal(reference) {
    const filter = datamanipulation.getOrderFromReference(reference,orders)
    console.log(filter)
    setOrderInfoData(filter);
    setOpen(true);
  }
    

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
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
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={() => {
                  openOrderInfoModal(row.reference);
                }}
              >
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>

                <TableCell align="right">
                  <Link href="#">{row.reference}</Link>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h7" color={"red"}>
                    {row.credit}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h7" color={"green"}>
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
