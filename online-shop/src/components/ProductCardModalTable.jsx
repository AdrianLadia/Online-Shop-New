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
    let isPack = null
    console.log(props.specs)

    if (props.specs.unit == 'Pack') {
      isPack = true
    }
    else {
      isPack = false
    }


    Object.keys(props.specs).map((key) => {
        if (isPack) {
          if (['piecesPerPack','packsPerBox'].includes(key)) {
            return
          }
        }
        rows.push(createData(key,props.specs[key])) // key is the key of the object, props.specs[key] is the value of the key of the object
     
    })

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

  return (
    <TableContainer sx={{justifyContent:'center'}} className='bg-colorbackground '>
      <Table aria-label="simple table" className='w-full bg-color10c'>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.key}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              className='bg-white'
            >
              <TableCell component="th" scope="row">
                {capitalizeFirstLetter(row.key)}
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
