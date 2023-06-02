import React from 'react';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip, LineController, BarController } from 'chart.js';
ChartJS.register( LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip, LineController, BarController );

export default function Graph(props) {
  const productData = props.data;
  const salesData = productData.salesPerMonth;
  const monthNames = [ '', 'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const barData = [12, 21, 35, 13, 15, 36, 17, 28, 12, 17, 28, 12];

  const data = {
    labels,
    datasets: [
      {
        type: 'line' ,
        label: 'Sales',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 2,
        fill: false,
        data: salesData && salesData.map((sale) => sale.totalSalesPerMonth),
      },
      {
        type: 'bar' ,
        label: 'Stocks',
        backgroundColor: 'rgb(75, 192, 192)',
        data: barData,
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };
  return (
    <Chart type='bar' data={data} />
  );
}
