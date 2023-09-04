import React, {useEffect, useState} from 'react'
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import useWindowDimensions from '../customerAnalytics/UseWindowDimentions';
import businessCalculation from '../customerAnalytics/businessCalculation';

const PastAverageTimeOrders = ({customerData, lastOrderDate, customerRanking}) => {

    const businesscalculation = new businessCalculation();
    const { width } = useWindowDimensions();
    const today = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
    const customerDataForTable = []
    // const customerNotLate = []

    if(lastOrderDate){
        Object.keys(lastOrderDate).map((customer, index)=>{
            const dates = []
            let startOrderDate = ""
            let endOrderDate = lastOrderDate[customer]
            if(customerData[customer]){
                Object.keys(customerData[customer]).map((key)=>{
                    dates.push(key)
                })
                const sortedDates = dates.sort((a, b) => new Date(a) - new Date(b));
                startOrderDate = sortedDates[0]
            }
            const averageInterval = businesscalculation.getAverageTimeBetweenPurchases(customerData, customer, startOrderDate, endOrderDate)
            const differenceInDays = (new Date(today) - new Date(endOrderDate)) / (24 * 60 * 60 * 1000) ;
            if(differenceInDays >= parseInt(averageInterval.slice(0,averageInterval.length - 7) - 2) || averageInterval=="No Interval"){
                customerDataForTable.push({name:customer, averageInterval:averageInterval, differenceInDays: differenceInDays , id:index})
            }
            // else{
            //     customerNotLate.push({name:customer, averageInterval:averageInterval, differenceInDays: differenceInDays , id:index})
            // }
        })
    }

    const sortedDataForTable = []

    customerRanking.map((customer)=>{
        customerDataForTable.map((info)=>{
            if(info.name == customer){
                sortedDataForTable.push(info)
            }
        })
    })

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


    const columns = [
        {
            field:"name",
            headerName: ( <div style={headerStyle()}>Customer Name</div> ),
            width: headerWidth(),   
            disableColumnMenu: true, sortable: false,
        },
        {
            field:"averageInterval",
            headerName: ( <div style={headerStyle()}>{width <= 768?"Average Interval":"Average Purchase Interval"}</div> ),
            width: headerWidth(),
            disableColumnMenu: true, sortable: false,
        },
        {
            field:"differenceInDays",
            headerName: ( <div style={headerStyle()}>{width <= 768? "Since Last Order" : "Days Since Last Order"}</div> ),
            width: headerWidth(),
            disableColumnMenu: true, sortable: false,
            renderCell:(sortedDataForTable)=>(
                <div
                    style={{
                        color: sortedDataForTable.formattedValue > parseInt(sortedDataForTable.row.averageInterval.slice(0,sortedDataForTable.row.averageInterval.length - 7)) ? '#CD1818' : 
                        sortedDataForTable.formattedValue == parseInt(sortedDataForTable.row.averageInterval.slice(0,sortedDataForTable.row.averageInterval.length - 7)) ? '#E7B10A' : 
                        sortedDataForTable.formattedValue < parseInt(sortedDataForTable.row.averageInterval.slice(0,sortedDataForTable.row.averageInterval.length - 7)) ? '#7A9D54' : 'Black'
                    }}
                >
                  
                    {sortedDataForTable.formattedValue}
                </div>
            )
        }
    ]

  return (
    <div className=" flex justify-center items-center w-full mt-4 mb-6 ">
        <Box className='bg-opacity-10 overflow-y-auto w-full xs:w-11/12 h-70per bg-green-100 border  border-green-400 rounded-lg'>
            <DataGrid
                rows={sortedDataForTable}
                columns={columns}
                hideFooter={true}
                density={"comfortable"}
                rowSelection={false}
                showCellVerticalBorder={false}
            />
      </Box>
    </div>
  )
}

export default PastAverageTimeOrders