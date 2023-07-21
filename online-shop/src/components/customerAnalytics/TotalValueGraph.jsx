import React, {useState, useEffect} from 'react'
import businessCalculation from './businessCalculation'
import dataManipulation from './dataManipulation';
import { Chart } from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TotalValueGraph = ({data, chosenCustomer}) => {
    const businesscalculation = new businessCalculation();
    const datamanipulation = new dataManipulation();
    const [ tableData, setTableData ] = useState([])
    const dateToday = new Date().toISOString().slice(0,10)
    
    const yearToday = dateToday.slice(0,4)
    const monthToday = dateToday.slice(5,7)

    useEffect(()=>{
      const toSet = businesscalculation.getTotalValueOfOrder( data, chosenCustomer )
      setTableData(toSet)
    },[chosenCustomer])

    const monthNames = [ 'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
    let labels = [];
    const forGraphValues = [];
    tableData&&tableData.map((item)=>{
      // WE REMOVE DATA OF THIS MONTH BECAUSE IT IS INCOMPLETE
      const date = item.date.slice(0,7)
      const dataDateMonth = date.slice(5,7)
      const dataDateYear = date.slice(0,4)

      if (dataDateMonth == monthToday && dataDateYear == yearToday) {
        return
      }
      // ______________________________________________________

      if(labels.some(item => item.includes(date))){
        const index = labels.findIndex(item => item.includes(date))
        forGraphValues[index] += item.total
      }else{
        labels.push(date)
        forGraphValues.push(item.total)
      }
    })


    const newBarData = []

    try{
      labels = labels.map((item)=>item.replace(/-/g, ''))

      const newData = []

      for(let i = 0; i < labels.length; i++){
        newData.push({date:labels[i], value:forGraphValues[i]})
      }

      labels = datamanipulation.fillMissingMonths(labels)

      labels.map((month)=>{
        let value = 0
        
        newData.map((bar)=>{
          if(month == bar.date){
            value = bar.value
          }
        })
        if(value > 0){
          newBarData.push(value)
        }else{
          newBarData.push(0)
        }
      })

      labels = labels.map((date)=>monthNames[parseInt(date.slice(4, 6)) - 1] + date.slice(0, 4))
    }catch(e){}

    const graphData = {
      labels,
      datasets: [
        {
          type: 'bar' , label: chosenCustomer ? chosenCustomer + " total sales" : "Select a Customer" , data: newBarData,
          borderWidth: 1, pointRadius: 4, pointHoverRadius: 6, pointHitRadius: 6,
          borderColor: 'black',
          backgroundColor: 'rgba(0, 223, 162, 0.3)',
        }
      ]
    }

  return (
    <div className='w-full h-full flex justify-center '>
      <div className='p-2 overflow-auto w-full xs:w-11/12 rounded-b-lg border-t-0 border-green-700 h-full flex flex-col justify-center items-center border-2 bg-gradient-to-t from-stone-100 to-green-100'>
        <Chart data={graphData} />
      </div>  
    </div>
  )
}

export default TotalValueGraph