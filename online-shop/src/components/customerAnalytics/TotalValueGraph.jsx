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
    
    useEffect(()=>{
      const toSet = businesscalculation.getTotalValueOfOrder( data, chosenCustomer )
      setTableData(toSet)
    },[chosenCustomer])

    const monthNames = [ 'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
    let labels = []
    const forGraphValues = []
    tableData&&tableData.map((item)=>{
      const date = item.date.slice(0,7)
      if(labels.some(item => item.includes(date))){
        const index = labels.findIndex(item => item.includes(date))
        forGraphValues[index] += item.total
      }else{
        labels.push(date)
        forGraphValues.push(item.total)
      }
    })

    labels = labels.map((date)=>monthNames[parseInt(date.slice(5, 7))- 1] + date.slice(0,4))

    const graphData = {
      labels,
      datasets: [
        {
          type: 'bar' , label: chosenCustomer, data: forGraphValues,
          borderWidth: 1, pointRadius: 4, pointHoverRadius: 6, pointHitRadius: 6,
          borderColor: 'black',
          backgroundColor: 'rgba(0, 223, 162, 0.3)',
        }
      ]
    }

  return (
    <div className='w-full h-full flex justify-center '>
      <div className='w-full xs:w-11/12 rounded-b-lg border-t-0 border-green-700 h-full flex flex-col justify-center items-center border-2 bg-gradient-to-t from-stone-100 to-green-100'>
        <Chart data={graphData} className='flex '/>
      </div>  
    </div>
  )
}

export default TotalValueGraph