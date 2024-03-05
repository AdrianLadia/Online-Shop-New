import React from 'react';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);
import InvalidDates from './InvalidDates.js'

export default function Graph(props) {
  const productData = props.data;
  const monthNames = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  const updatedStocksLowestPoint = [];
  const invalidDates = new InvalidDates().getInvalidDates();


  let latestStocksLowestPoint = 0;
  if (productData.stocksLowestPoint) {
    productData.stocksLowestPoint.forEach((stock) => {
      if (stock.lowestPoint == null) {
        stock.lowestPoint = latestStocksLowestPoint;
      } else {
        latestStocksLowestPoint = stock.lowestPoint;
      }
      console.log(stock.year, stock.month);
      const date = new Date(stock.year, stock.month, 1);

      //  date to exclude because all data in these dates is invalid
      if ( invalidDates.includes(date.getTime()) === false) {
        updatedStocksLowestPoint.push({ lowestPoint: stock.lowestPoint, month: stock.month, year: stock.year });
      }
    });
  }

  const labels =
    productData.salesPerMonth &&
    productData.salesPerMonth.map((sale) => {
      const date = new Date(sale.year, sale.month, 1);
      //  date to exclude because all data in these dates is invalid
      if (invalidDates.includes(date.getTime()) === false) {
        return monthNames[sale.month - 1] + sale.year;
      }
    });

  const totalSalesPerMonth =
    productData.salesPerMonth &&
    productData.salesPerMonth.map((sale) => {
      const date = new Date(sale.year, sale.month, 1);
      if (invalidDates.includes(date.getTime()) === false) {
        return sale.totalSalesPerMonth;
      }
    });
  const barLowestPoint = updatedStocksLowestPoint && updatedStocksLowestPoint.map((bar) => bar.lowestPoint);

  const data = {
    labels,
    datasets: [
      {
        type: 'line',
        label: 'Sales',
        data: totalSalesPerMonth,
        borderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHitRadius: 6,
        borderColor: 'gray',
        backgroundColor: 'lightgray',
        pointBackgroundColor: (context) => {
          const value = context.dataset.data[context.dataIndex];
          const average = context.dataset.average;
          return value > average ? '#03C988' : value < average ? '#FF0032' : value == average ? '#FFEE63' : 'gray';
        },
      },
      {
        type: 'bar',
        label: 'Stocks',
        data: barLowestPoint,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'gray',
        borderWidth: 1,
      },
    ],
  };

  const average =
    data && data.datasets && data.datasets[0] && data.datasets[0].data
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

  return <Chart type="bar" data={data} options={options} />;
}
