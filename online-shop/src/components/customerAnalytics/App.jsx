import React, { useEffect, useState, useContext } from 'react';
import AppContext from "../../AppContext";
import CustomerDropdown from './CustomerDropdown';
import CustomerTable from './CustomerTable';
import PurchaseFrequency from './PurchaseFrequency';
import TimeBetweenPurchases from './TimeBetweenPurchases';
import TotalValueGraph from './TotalValueGraph';


const App = () => {
    const { firestore } = useContext(AppContext)
    const [ customerMonthlySales, setCustomerMonthlySales ] = useState({})
    const [ purchaseFrequencyAndTimeBetweenPurchases, setPurchaseFrequencyAndTimeBetweenPurchases] = useState({})
    const [ totalValueOfOrder, setTotalValueOfOrder ] = useState({})
    const [ chosenCustomer, setChosenCustomer ] = useState('')
    const [customerTotalValueRanking,setCustomerTotalValueRanking] = useState([])

    

    useEffect(()=>{
        firestore.readAllDataFromCollection('Analytics').then((data) => {
            setCustomerMonthlySales(data[0])
            setPurchaseFrequencyAndTimeBetweenPurchases(data[2])
            setTotalValueOfOrder(data[3])
        });
    },[])

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
            customerAndTotalValue.forEach((customer,index)=>{
                ranking.push(customer['customer'])
            })

            setCustomerTotalValueRanking(ranking)
        }
    },[totalValueOfOrder])
 
    return (
        <div className=' w-full flex flex-col '>
            <div className=' w-full flex flex-col items-start justify-start gap-2'>
                <div className='h-1/10 w-full mt-4'>
                    <CustomerDropdown data={customerMonthlySales} setChosen={setChosenCustomer} customerTotalValueRanking={customerTotalValueRanking}/>
                </div>
                <div className='h-screen w-full '>
                    <CustomerTable data={customerMonthlySales} chosenCustomer={chosenCustomer} firestore={firestore}/>
                </div>
                <div className='h-mid w-full flex justify-center'>
                    <div className=' flex w-full xs:w-11/12 p-2 border-y-0 items-center justify-evenly bg-gradient-to-t from-stone-100 to-green-100 border-2 border-green-700 divide-x divide-green1'>
                        <div className='w-1/2 h-full '>
                            <PurchaseFrequency data={purchaseFrequencyAndTimeBetweenPurchases} chosenCustomer={chosenCustomer}/>
                        </div>
                        <div className='w-1/2 h-full '>
                            <TimeBetweenPurchases data={purchaseFrequencyAndTimeBetweenPurchases} chosenCustomer={chosenCustomer}/>
                        </div>
                    </div>
                </div>
                <div className='h-mid w-full flex justify-center mb-3'>
                    <TotalValueGraph data={totalValueOfOrder} chosenCustomer={chosenCustomer}/>
                </div>
            </div>
        </div>
    )
}

export default App