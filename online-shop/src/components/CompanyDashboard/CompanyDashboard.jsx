import React, { useEffect,useContext,useState } from 'react'
import AppContext from '../../AppContext'
import businessCalculation from '../customerAnalytics/businessCalculation';
import PastAverageTimeOrders from './PastAverageTimeOrders';
import { Chart } from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CompanyDashboard = () => {

    const { firestore } = useContext(AppContext);
    const businesscalculation = new businessCalculation();
    const [overallTotalSalesValue, setOverallTotalSalesValue] = useState(0);
    const [customersLastOrderDate, setCustomersLastOrderDate] = useState({});
    const [ totalValueOfOrder, setTotalValueOfOrder ] = useState({})
    const [customerData, setCustomerData] = useState([])
    const [ customerTotalValueRanking, setCustomerTotalValueRanking ] = useState([])
    const monthNames = [ 'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
    
    useEffect(() => {
        firestore.readSelectedDataFromCollection('Analytics','PurchaseFrequencyAndTimeBetweenPurchases').then((data) => {
          setCustomerData(data)
        });
        firestore.readSelectedDataFromCollection('Analytics','overallTotalSalesValue').then((data) => {
          setOverallTotalSalesValue(data.data);
        });
        firestore.readSelectedDataFromCollection('Analytics','CustomerLastOrderDate').then((data) => {
          setCustomersLastOrderDate(data)
        });
        firestore.readSelectedDataFromCollection('Analytics','TotalValueOfOrder').then((data) => {
          setTotalValueOfOrder(data)
      });
    }, [])

    useEffect(()=>{
      if (totalValueOfOrder != {}){
          const customerAndTotalValue = []
          Object.keys(totalValueOfOrder).forEach((key)=>{
              const customer = key
              const value = totalValueOfOrder[key];
              let totalValue = 0
              Object.keys(value).forEach((key)=>{
                  const orderValue = value[key] 
                  Object.keys(orderValue).forEach((key)=>{
                      const orderAmount = orderValue[key]
                      totalValue += orderAmount
                  })
              })
              customerAndTotalValue.push({customer,totalValue})
          })
          customerAndTotalValue.sort((a, b) => b.totalValue - a.totalValue);
          const ranking = []
          customerAndTotalValue.forEach((customer, index)=>{
              ranking.push(customer['customer'])
          })
          setCustomerTotalValueRanking(ranking)
      }
  },[totalValueOfOrder])

    const newData = []

    Object.keys(overallTotalSalesValue).map((date)=>{
      if(date.length == 6){
        let newMonth = date.replace(/-(\d)$/, '-0$1')
        newData.push({date: newMonth.replace(/-/g, ''),value:overallTotalSalesValue[date]})
      }else{
        newData.push({date: date.replace(/-/g, ''),value:overallTotalSalesValue[date]})
      }
    })

    newData.sort((a, b) => (a.date > b.date ? 1 : -1));

    let labels = []
    const values = []

    newData.map((item)=>{
      labels.push(item.date)
      values.push(item.value)
    })

    labels = labels.map((date)=>monthNames[parseInt(date.slice(4, 6)) - 1] + date.slice(0, 4))

    const graphData = {
      labels,
      datasets: [
        {
          type: 'bar' , label: 'Total Sales', data: values,
          borderWidth: 0.5,
          borderColor:(context) => {
            const value = context.dataset.data[context.dataIndex];
            const average = context.dataset.average;
            return value >= average - (average * .1) && value <= average + (average * .1)? ('#C87941') :
                   value > average ? ('#1A5D1A') : 
                   value < average ? ('#950101') : ('gray');
          },
          backgroundColor:
            (context) => {
              const value = context.dataset.data[context.dataIndex];
              const average = context.dataset.average;
              return value >= average - (average * .1) && value <= average + (average * .1)? ('rgba(255, 255, 0, 0.2)') :
                     value > average ? ('rgba(0, 255, 0, 0.1)') : 
                     value < average ? ('rgba(255, 0, 0, 0.2)') : ('gray');
            },
        }
      ]
    }

    const average = graphData && graphData.datasets && graphData.datasets[0] && graphData.datasets[0].data
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
      plugins:{
        tooltip:{
          displayColors: false,
          yAlign: 'bottom',
          backgroundColor: colorItems
        }
      }
    };

    function colorItems(tooltipItem){
      return tooltipItem.tooltip.labelColors[0].borderColor
    }

  return (
    <div className=' w-full gap-3 flex flex-col justify-center items-center '>
      <div className='h-80per w-full xs:w-11/12 flex flex-col justify-center items-center font-serif tracking-wider border border-green-400 rounded-lg p-3 mt-4'>Company Dashboard
        <Chart type='bar' data={graphData} options={options}/>
      </div>
      <div className=' mb-8 w-full flex justify-center items-center'>
        <PastAverageTimeOrders customerData={customerData} lastOrderDate={customersLastOrderDate} customerRanking={customerTotalValueRanking}/>
      </div>
    </div>
  )
}

export default CompanyDashboard
