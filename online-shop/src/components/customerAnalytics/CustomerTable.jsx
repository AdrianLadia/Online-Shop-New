import React, {useEffect, useState} from 'react'
import { DataGrid } from "@mui/x-data-grid";
import useWindowDimensions from './UseWindowDimentions';
import Box from "@mui/material/Box";
import dataManipulation from './dataManipulation';
import CustomerGraph from './CustomerGraph';

const CustomerTable = ({ data, chosenCustomer, firestore, products }) => {
  const datamanipulation = new dataManipulation()
  const { width } = useWindowDimensions();
  const [ customerData, setCustomerData ] = useState([])

  useEffect(()=>{
    const info = datamanipulation.getDataOfChosenCustomer( data, chosenCustomer, products )
    setCustomerData(info)
  },[chosenCustomer])

  function headerStyle(){
    return{
      fontFamily: "Lucida Sans Unicode, sans-seriff",
      padding: "10px",
      letterSpacing: "2px",
      fontWeight: "semibold",
    }
  }

  function headerWidth(){
    if(width <= 768){
      return 200
    }else if(width <= 1024){
      return 300
    }else if(width < 1366){
      return 330
    }else if(width > 1367){
      return 380
    }else{
      return 310
    }
  }

  function graphWidth(){
    if(width <= 768){
      return 350
    }else if(width <= 1024){
      return 600
    }else if(width < 1366){
      return 800
    }else if(width > 1367){
      return 1000
    }else{
      return 1100
    }
  }

  function rowHeight(){
    if(width <= 768){
      return 230
    }else if(width <= 1024){
      return 250
    }else if(width <= 1400){
      return 310
    }else if(width <= 1600){
      return 330
    }else if(width >= 1919){
      return 350
    }else{
      return 360
    }
  }

  const columns = [
    { 
      field: 'name', 
      width: headerWidth(),
      headerName: ( <div style={headerStyle()}>ITEM ID</div> ),
      headerClassName: 'header-theme', align: "center", headerAlign: "center",
      disableColumnMenu: true, sortable: false,
      renderCell: (customerData) => (<div>{customerData.row.name}</div>),
    },
    {
      field: 'graph',
      width: graphWidth(),
      headerName: ( <div style={headerStyle()}>{chosenCustomer? chosenCustomer.toUpperCase() + ", SALES & STOCKS" : "SALES & STOCKS"}</div> ),
      headerClassName: 'header-theme', align: "center", headerAlign: "center",
      editable: false, sortable: false, disableColumnMenu: true,
      renderCell: (customerData) => (<CustomerGraph data={customerData.row} firestore={firestore} products={products}/>),
    },
    { 
      field: 'totalSales', 
      headerName: ( <div style={headerStyle()} > TOTAL VALUE </div> ),
      headerClassName: 'header-theme', align: "center", headerAlign: "center",
      width: headerWidth(),
      disableColumnMenu: true, sortable: false,
      renderCell: (customerData) => (<div>{customerData.row.totalSales}</div>),
    },
  ];
  
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Box className='overflow-y-auto w-full xs:w-11/12 h-full bg-gradient-to-t from-stone-100 to-green-100 border-b-0 border-2 border-green-700 rounded-t-lg' 
        sx={{ height: '100%', "& .header-theme": {borderBottom:2 , backgroundImage: "linear-gradient(to bottom, #95E8D7, #ADF7D1)"}}}>
        <DataGrid
          rows={customerData}
          columns={columns}
          rowHeight={rowHeight()}
          hideFooter={true}
          // sortingOrder={['desc', 'asc']}
          disableColumnSelector={true}
          disableRowSelectionOnClick={true}
          disableDensitySelector={true}
          sortModel={[{field: 'totalSales', sort: 'desc'}]}
        />
      </Box>
    </div>
  )
}

export default CustomerTable