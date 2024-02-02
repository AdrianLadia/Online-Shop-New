import React, { useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import stockManagementTableDataHandler from '../../../utils/classes/stockMangementTableDataHandler';
import AppContext from '../../AppContext';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Typography } from '@mui/material';

const StockManagementTable = ({ products }) => {
  const { firestore } = useContext(AppContext);
  const [rowsWholesale, setRowsWholesale] = useState([]);
  const [wholesaleSearch, setWholesaleSearch] = useState('');
  const [rowsRetail, setRowsRetail] = useState([]);
  const [hideSlowMovingCheckbox, setHideSlowMovingCheckbox] = useState(true);
  const columnsWholesale = [
    {
      field: 'itemName',
      headerName: 'Item Name',
      width: 300,
      editable: false,
    },
    {
      field: 'stocksAvailable',
      headerName: 'Stocks Available',
      width: 150,
      editable: false,
      align: 'center',
    },
    {
      field: 'suggestedStocks',
      headerName: 'Suggested Stocks',
      type: 'number',
      width: 110,
      editable: false,
      align: 'center',
    },
    {
      field: 'inventoryLevel',
      headerName: 'Inventory Level',
      width: 160,
      align: 'center',
      valueFormatter: (params) => {
        return `${params.value}%`;
      },
    },
  ];

  const columnsRetail = [
    {
      field: 'itemName',
      headerName: 'Item Name',
      width: 300,
      editable: false,
    },
    {
      field: 'stocksAvailable',
      headerName: 'Stocks Available',
      width: 150,
      editable: false,
      align: 'center',
    },
    {
      field: 'packsPerBox',
      headerName: 'Suggested Stocks',
      type: 'number',
      width: 110,
      editable: false,
      align: 'center',
    },
    {
      field: 'inventoryLevel',
      headerName: 'Inventory Level',
      width: 160,
      align: 'center',
      valueFormatter: (params) => {
        return `${params.value}%`;
      },
    },
  ]

  useEffect(() => {
    async function getStockManagementTableData() {
      const averageSalesPerDay = await firestore.readSelectedDataFromCollection('Analytics', 'itemAverageSalesPerDay');
      const averageSalesPerDatData = averageSalesPerDay.data;
      const stockManagementTableData = new stockManagementTableDataHandler(
        products,
        averageSalesPerDatData,
        hideSlowMovingCheckbox,
        0.5
      );
      const wholesaleData = stockManagementTableData.getWholesaleData();
      const retailData = stockManagementTableData.getRetailData();

      setRowsWholesale(wholesaleData);
      setRowsRetail(retailData);
    }

    getStockManagementTableData();
  }, [products,hideSlowMovingCheckbox]);

  return (
    <div className="flex w-full h-full flex-col items-center">
      {/* Item Name */}
      {/* Stocks Available */}
      {/* Suggested Stocks*/}
      {/*  */}
      <Typography variant="h5" className="mt-5">
        Stock Management Table
      </Typography>
      <Typography variant="subtitle1" className="mt-2">
        Wholesale
      </Typography>

      <div className="flex w-full ml-44">
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              checked={hideSlowMovingCheckbox}
              onChange={() => {
                setHideSlowMovingCheckbox(!hideSlowMovingCheckbox);
              }}
            />
          }
          label="Hide Slow Moving"
        />
      </div>
      <Box sx={{ height: '80vh', width: '92%' }}>
        <DataGrid
          rows={rowsWholesale}
          columns={columnsWholesale}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 50,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
      <Typography variant="subtitle1" className="my-10">
        Retail
      </Typography>
      <Box sx={{ height: '80vh', width: '92%' }}>
        <DataGrid
          rows={rowsRetail}
          columns={columnsRetail}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 50,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </div>
  );
};

export default StockManagementTable;
