import React from "react";

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import useWindowDimensions from './UseWindowDimensions';
import TableRow from '@mui/material/TableRow';

const CartTable = (props) => {

    const {width, height} = useWindowDimensions();
    function getMaxHeightTable() {
        return height - 355
    }

    const rows = props.rows

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const columns = [
        { id: 'itemimage', label: 'Image', minWidth: 120},
        { id: 'itemName', label: 'Item', minWidth:1 },
        {
          id: 'pieces',
          label: 'Pieces/Unit',
          minWidth: 1,
          align: 'left',
          format: (value) => value.toLocaleString('en-US'),
        },
        { id: 'quantity', label: 'Qty', minWidth: 1 },

        { id: 'addbutton', label: 'Add', minWidth: 1 },
        { id: 'removebutton', label: 'Remove', minWidth: 1 },
        {
          id: 'price',
          label: 'Price/Unit',
          minWidth: 1,
          align: 'right',
          format: (value) => value.toLocaleString('en-US'),
        },
        {
          id: 'totalPieces',
          label: 'Total Pieces',
          minWidth: 1,
          align: 'right',
          format: (value) => value.toLocaleString('en-US'),
        },
        {
          id: 'total',
          label: 'Total Price',
          minWidth: 1,
          align: 'right',
          format: (value) => value.toLocaleString('en-US'),
        }
      ];

  return (
    <Paper elevation={10} className="mt-4 border-2 border-color60" >
      <TableContainer sx={{ maxHeight: 430}} >
        <Table stickyHeader aria-label="sticky table">
          <TableHead >
            <TableRow >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{ minWidth: column.minWidth}}
                  className="bg-color10c font-bold"
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column) => {
                      const value = row[column.id];
                    
                      if (column.id === 'itemimage') {
                        return(
                          <TableCell key={column.id} align={column.align}>
                            <img src={value} className='h-20 w-20'/>
                          </TableCell>
                        )
                      }
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CartTable;
