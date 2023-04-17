import React,{useEffect, useState} from 'react';
import { Line } from 'react-chartjs-2';

const LineGraph = (props) => {

  const productData = props.data;
  const salesData = productData.salesPerMonth;
  const monthNames = [  
  '',
  'Jan.',
  'Feb.',
  'Mar.',
  'Apr.',
  'May.',
  'June',
  'July',
  'Aug.',
  'Sept.',
  'Oct.',
  'Nov.',
  'Dec.',
  ];

  // console.log(salesData)

const data = {
  labels: salesData && salesData.map((sale) => `${monthNames[sale.month]} ${sale.year}`),
  datasets: [
      {
      data: salesData && salesData.map((sale) => sale.totalSalesPerMonth),                    
        tension: .3,
        borderColor: 
        (context) => {
          const value = context.dataset.data[context.dataIndex];
          const average = context.dataset.average;

          return value > average ? ('#5D9C59') : value < average ? ('#CD0404') : value == average ? ('#EBB02D') : "#B2B2B2";
        },
        
        fill: false,
        pointBackgroundColor:
        (context) => {
          const value = context.dataset.data[context.dataIndex];
          const average = context.dataset.average;

          return value > average ? ('#03C988') : value < average ? ('#FF0032') : value == average ? ('#FFEE63') : "";
        },
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHitRadius: 6,
        pointHoverBackgroundColor: 
         (context) => {
          const value = context.dataset.data[context.dataIndex];
          const average = context.dataset.average;

          return value > average ? ('#DDF7E3') : value < average ? ('#FFCEFE') : value == average ? ('#FFF9B0') : "";
        },
        label: productData.itemName,
      }
    ]
  };

      const average = data && data.datasets && data.datasets[0] && data.datasets[0].data
      ? data.datasets[0].data.reduce((acc, val) => acc + val, 0) / data.datasets[0].data.length
      : 0;

      if (data && data.datasets && data.datasets[0]) {
        data.datasets[0].average = average;
      }

  const options={
      plugins: {
        tooltips: {
          enabled: true,
          mode: 'index',
          intersect: false
      },
      },
      responsive: true,
      scales:{
          x:{
            ticks:{
              display: true,
            },
            grid:{
              display: true
             }
            },
          y:{
            ticks:{
              stepSize:6,
              beginAtZero: true,
              display: true,
            },
            grid:{
              display: true
              }
            }
          },
        }

  return (

    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: "100%", height: "100%"}}>
        
            <Line data={data} options={options}/>
        
    </div>
  );
};

export default LineGraph;