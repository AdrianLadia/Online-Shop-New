import React, { useEffect, useState } from 'react'
import dataManipulation from './dataManipulation';
import { Chart } from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CustomerGraph = ({data, products}) => {
    const datamanipulation = new dataManipulation();
    const [ productData, setProductData ] = useState([])

    useEffect(()=>{
      const productsData = products.filter((info) => info.itemName == data.name);
      setProductData(productsData[0])
    },[])

    const monthNames = [ 'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
    const filteredData = datamanipulation.filterDataForGraph(data);
    filteredData.sort((a, b) => {if (a[0] !== b[0]) {return a[0] - b[0]; } if (a[1] !== b[1]) {return a[1] - b[1];}});
    const barLowestPoint = productData.stocksLowestPoint && productData.stocksLowestPoint.map((bar, index) => {if(bar.lowestPoint >= 0) {return bar.lowestPoint} else if(bar.lowestPoint < 0 || bar.lowestPoint == undefined) {return 0}});
    try{
      barLowestPoint&&barLowestPoint.sort((a, b) => {if (a[1] !== b[1]) {return a[1] - b[1]; } });
    }catch(e){

    }

    const dates = []
    const totalSalesPerMonth = []
    filteredData&&filteredData.map((sale)=>{
      if(dates.some(item => item.includes(sale[0] + sale[1]))){
        const index = dates.findIndex(item => item.includes(sale[1]))
        totalSalesPerMonth[index] += sale[2]
      }else{
        dates.push(sale[0] + sale[1])
        totalSalesPerMonth.push(sale[2])
      }
    })

    const salesData = []

    for (let i = 0; i < totalSalesPerMonth.length; i++) {
      salesData.push({
        date: dates[i],
        sale: totalSalesPerMonth[i]
      });
    }

    const newD = datamanipulation.fillMissingMonths(dates)

    const barDates = [];
    const stocksLowestPoint = productData.stocksLowestPoint;
    stocksLowestPoint && stocksLowestPoint.map((s) => {
      const month = s.month.toString()
      let newMonth = ''
      if(month.length == 1){
        newMonth = "0" + month
      }else{
        newMonth = month
      }
      barDates.push({date: s.year.toString() + newMonth, barPoints: s.lowestPoint});
    });

    let labels = []

    try{
      labels = newD.map((date)=>monthNames[parseInt(date.slice(4, 6)) - 1] + date.slice(0, 4))
    }catch(e){

    }

    const newSalesData = []
    const newBarData = []

    try{
      let index = 0
      for ( let i = 0; i <= newD.length; i++ ){
        if(salesData[index]){
          if(salesData[index].date === newD[i] ){
            newSalesData.push(salesData[index].sale)
            index += 1
          }else{
            newSalesData.push(0)
          }
        }
      }

      newD.map((month)=>{
        let value = 0
        barDates.map((bar)=>{
          if(month == bar.date){
            value = bar.barPoints
          }
        })
        if(value > 0){
          newBarData.push(value)
        }else{
          newBarData.push(0)
        }
      })
    }catch(e){

    }

    const graphData = {
        labels,
        datasets: [
          {
            type: 'line' , label: 'Sales', data: newSalesData,
            borderWidth: 1, pointRadius: 4, pointHoverRadius: 6, pointHitRadius: 6,
            borderColor: 'gray',
            backgroundColor: 'lightgray',
            pointBackgroundColor:
            (context) => {
              try{
                const value = graphData.datasets[1].data[context.dataIndex];
                const average = graphData.datasets[1].baraverage
                return value >= average && value <= 60 ? ('#FFEE63') : value > average ? ('#03C988') : value < average ? ('#FF0032') : ('gray');
              }catch(e){
                return 'gray'
              }
            },
          },
          {
            type: 'bar' , label: 'Stocks', data: newBarData,
            borderColor: 'black',
            borderWidth: 0.5,
            backgroundColor:
            (context) => {
              const value = context.dataset.data[context.dataIndex];
              const average = context.dataset.average;
              return value >= average && value <= average + 10 ? ('rgba(255, 255, 0, 0.2)') :
                     value > average ? ('rgba(0, 255, 0, 0.1)') : 
                     value < average ? ('rgba(255, 0, 0, 0.2)') : ('gray');
            },
            hidden: true,
          },
        ],
      };

    const average = graphData && graphData.datasets && graphData.datasets[0] && graphData.datasets[0].data
    ? graphData.datasets[0].data.reduce((acc, val) => acc + val, 0) / graphData.datasets[0].data.length
    : 0;

    if (graphData && graphData.datasets && graphData.datasets[0]) {
        graphData.datasets[0].average = average;
    }

    const baraverage = graphData && graphData.datasets && graphData.datasets[1] && graphData.datasets[1].data
    ? graphData.datasets[1].data.reduce((acc, val) => acc + val, 0) / graphData.datasets[1].data.length
    : 0;

    if (graphData && graphData.datasets && graphData.datasets[1]) {
        graphData.datasets[1].average = baraverage;
        graphData.datasets[1].baraverage = 50;
    }

    const options = {
        plugins: {
          tooltip: {
            callbacks: {
              afterBody: function(context) {
                if(context[0].datasetIndex == 0){
                  return( "    Stocks: " + graphData.datasets[1].data[context[0].dataIndex])
                }else if (context[0].datasetIndex == 1){
                  return( "    Sales: " + graphData.datasets[0].data[context[0].dataIndex])
                }else{
    
                }
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
          },
          x: {
            beginAtZero: true,
          },
        },
      };

  return (
    <Chart type='bar' data={graphData} options={options}/>
  )
}

export default CustomerGraph