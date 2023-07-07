import React, { useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip, LineController, BarController } from 'chart.js';
ChartJS.register( LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip, LineController, BarController );

export default function Graph(props) {
  const productData = props.data;
  const monthNames = [ 'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  const labels = productData.salesPerMonth && productData.salesPerMonth.map((sale)=> (monthNames[(sale.month - 1 )] + sale.year));
  const totalSalesPerMonth = productData.salesPerMonth && productData.salesPerMonth.map((sale) => sale.totalSalesPerMonth);
  const barLowestPoint = productData.stocksLowestPoint && productData.stocksLowestPoint.map((bar) => bar.lowestPoint);

  const data = {
    labels,
    datasets: [
      {
        type: 'line' , label: 'Sales', data: totalSalesPerMonth,
        borderWidth: 1, pointRadius: 4, pointHoverRadius: 6, pointHitRadius: 6,
        borderColor: 'gray',
        backgroundColor: 'lightgray',
        pointBackgroundColor:
        (context) => {
          const value = context.dataset.data[context.dataIndex];
          const average = context.dataset.average;
          return value > average ? ('#03C988') : value < average ? ('#FF0032') : value == average ? ('#FFEE63') : ('gray');
        },
      },
      {
        type: 'bar' , label: 'Stocks', data: barLowestPoint,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'gray',
        borderWidth: 1,
      },
    ],
  };

  const average = data && data.datasets && data.datasets[0] && data.datasets[0].data
  ? data.datasets[0].data.reduce((acc, val) => acc + val, 0) / data.datasets[0].data.length
  : 0;

  if (data && data.datasets && data.datasets[0]) {
    data.datasets[0].average = average;
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Chart type='bar' data={data} options={options}/>
  );
}
