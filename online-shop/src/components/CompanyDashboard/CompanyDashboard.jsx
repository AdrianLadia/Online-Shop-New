import React, { useEffect, useContext, useState } from 'react';
import AppContext from '../../AppContext';
import PastAverageTimeOrders from './PastAverageTimeOrders';
import CategoryCheckboxes from './CategoryCheckboxes';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import menuRules from '../../../utils/classes/menuRules';
import StockManagementTable from './StockManagementTable';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CompanyDashboard = ({products}) => {
  const { firestore, categories, userdata } = useContext(AppContext);
  const [overallTotalSalesValue, setOverallTotalSalesValue] = useState(0);
  const [overallSalesPerItem, setOverallSalesPerItem] = useState([]);
  const [customersLastOrderDate, setCustomersLastOrderDate] = useState({});
  const [totalValueOfOrder, setTotalValueOfOrder] = useState({});
  const [customerData, setCustomerData] = useState([]);
  const [customerTotalValueRanking, setCustomerTotalValueRanking] = useState([]);
  const monthNames = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  const [allowedCategories, setAllowedCategories] = useState([]);
  const rules = new menuRules(userdata.userRole);

  console.log(products)
  

  useEffect(() => {
    if (categories) {
      setAllowedCategories(categories.filter((item) => item != 'Favorites'));
    }
  }, [categories]);

  useEffect(() => {
    firestore.readSelectedDataFromCollection('Analytics', 'PurchaseFrequencyAndTimeBetweenPurchases').then((data) => {
      setCustomerData(data);
    });
    firestore.readSelectedDataFromCollection('Analytics', 'overallTotalSalesValue').then((data) => {
      setOverallSalesPerItem(data.data);
    });
    firestore.readSelectedDataFromCollection('Analytics', 'CustomerLastOrderDate').then((data) => {
      setCustomersLastOrderDate(data);
    });
    firestore.readSelectedDataFromCollection('Analytics', 'TotalValueOfOrder').then((data) => {
      setTotalValueOfOrder(data);
    });
  }, []);

  useEffect(() => {
    if (totalValueOfOrder != {}) {
      const customerAndTotalValue = [];
      Object.keys(totalValueOfOrder).forEach((key) => {
        const customer = key;
        const value = totalValueOfOrder[key];
        let totalValue = 0;
        Object.keys(value).forEach((key) => {
          const orderValue = value[key];
          Object.keys(orderValue).forEach((key) => {
            const orderAmount = orderValue[key];
            totalValue += orderAmount;
          });
        });
        customerAndTotalValue.push({ customer, totalValue });
      });
      customerAndTotalValue.sort((a, b) => b.totalValue - a.totalValue);
      const ranking = [];
      customerAndTotalValue.forEach((customer, index) => {
        ranking.push(customer['customer']);
      });
      setCustomerTotalValueRanking(ranking);
    }
  }, [totalValueOfOrder]);

  useEffect(() => {
    let overallSalesPerItemData = {};

    Object.keys(overallSalesPerItem).map((date) => {
      const data = overallSalesPerItem[date];
      overallSalesPerItemData[date] = 0;
      let totalSales = 0;

      Object.keys(data).map((key) => {
        const value = data[key];
        const category = value.category;
        const totalValue = value.totalValue;

        if (allowedCategories.includes(category)) {
          totalSales += totalValue;
        }
      });
      overallSalesPerItemData[date] = totalSales;
    });

    setOverallTotalSalesValue(overallSalesPerItemData);
  }, [overallSalesPerItem, allowedCategories]);

  const newData = [];

  Object.keys(overallTotalSalesValue).map((date) => {
    if (date.length == 6) {
      let newMonth = date.replace(/-(\d)$/, '-0$1');
      newData.push({ date: newMonth.replace(/-/g, ''), value: overallTotalSalesValue[date] });
    } else {
      newData.push({ date: date.replace(/-/g, ''), value: overallTotalSalesValue[date] });
    }
  });

  newData.sort((a, b) => (a.date > b.date ? 1 : -1));

  let labels = [];
  const values = [];

  newData.map((item) => {
    labels.push(item.date);
    values.push(item.value);
  });

  labels = labels.map((date) => monthNames[parseInt(date.slice(4, 6)) - 1] + date.slice(0, 4));

  const graphData = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: 'Company Total Sales',
        data: values,
        borderWidth: 0.5,
        borderColor: (context) => {
          const value = context.dataset.data[context.dataIndex];
          const average = context.dataset.average;
          return value >= average - average * 0.1 && value <= average + average * 0.1
            ? '#C87941'
            : value > average
            ? '#1A5D1A'
            : value < average
            ? '#950101'
            : 'gray';
        },
        backgroundColor: (context) => {
          const value = context.dataset.data[context.dataIndex];
          const average = context.dataset.average;
          return value >= average - average * 0.1 && value <= average + average * 0.1
            ? 'rgba(255, 255, 0, 0.2)'
            : value > average
            ? 'rgba(0, 255, 0, 0.1)'
            : value < average
            ? 'rgba(255, 0, 0, 0.2)'
            : 'gray';
        },
      },
    ],
  };

  const average =
    graphData && graphData.datasets && graphData.datasets[0] && graphData.datasets[0].data
      ? graphData.datasets[0].data.reduce((acc, val) => acc + val, 0) / graphData.datasets[0].data.length
      : 0;

  if (graphData && graphData.datasets && graphData.datasets[0]) {
    graphData.datasets[0].average = average;
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        displayColors: false,
        yAlign: 'bottom',
        backgroundColor: colorItems,
      },
    },
  };

  function colorItems(tooltipItem) {
    return tooltipItem.tooltip.labelColors[0].borderColor;
  }

  return (
    <>
      {rules.checkIfUserAuthorized('companyDashboard') ? (
        <div className=" w-full gap-3 flex flex-col justify-center items-center ">
          <div className="flex justify-center items-end h-10per font-serif text-xl md:text-2xl tracking-wider">
            Company Dashboard
          </div>
          {/* {categories} */}
          <div className="h-quar w-full justify-center xs:w-11/12">
            <CategoryCheckboxes
              categories={categories}
              setAllowedCategories={setAllowedCategories}
              allowedCategories={allowedCategories}
            />
          </div>
          <div className="h-80per w-full xs:w-11/12 flex flex-col justify-center items-center font-serif tracking-wider border border-green-400 rounded-lg mt-4">
            <Chart type="bar" id="chart" data={graphData} options={options} />
          </div>
          <div className=" mb-8 w-full flex justify-center items-center">
            <PastAverageTimeOrders
              customerData={customerData}
              lastOrderDate={customersLastOrderDate}
              customerRanking={customerTotalValueRanking}
            />
          </div>
          <div className='flex w-screen '>
            <StockManagementTable products={products}/>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CompanyDashboard;
