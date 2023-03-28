import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useWindowDimensions from './UseWindowDimensions';

function createData(key,value) {
    return {key,value};
  }

const ProductCardModalTable = (props) => {

    const { height, width } = useWindowDimensions();
    let rows = []
    Object.keys(props.specs).map((key) => {
        rows.push(createData(key,props.specs[key])) // key is the key of the object, props.specs[key] is the value of the key of the object
     
    })

    function responsiveTableWidth() {
        if (width >= 1024) {
          return '50%';   
        } 
        if (width >= 600 && width < 1024) {
          return '80%';}
        else {
          return '90%';
        }
      }

  return (
    <TableContainer component={Paper} sx={{marginTop:2,display:'flex',justifyContent:'center'}}>
      <Table sx={{ width:responsiveTableWidth()}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell align="right">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.key}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.key}
              </TableCell>
              <TableCell align="right">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ProductCardModalTable
