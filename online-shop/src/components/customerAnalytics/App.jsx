import React, { useEffect, useState, useContext, useRef } from 'react';
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
    const [ customerTotalValueRanking, setCustomerTotalValueRanking ] = useState([])
    const [ startDate, setStartDate ] = useState('')
    const [ endDate, setEndDate ] = useState('')
    const dummy = useRef(null)

    useEffect(()=>{
        firestore.readSelectedDataFromCollection('Analytics','CustomerMonthlySales').then((data) => {
            setCustomerMonthlySales(data)
        });
        firestore.readSelectedDataFromCollection('Analytics','PurchaseFrequencyAndTimeBetweenPurchases').then((data) => {
            setPurchaseFrequencyAndTimeBetweenPurchases(data)
        
        });

        firestore.readSelectedDataFromCollection('Analytics','TotalValueOfOrder').then((data) => {
            setTotalValueOfOrder(data)
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
            customerAndTotalValue.forEach((customer, index)=>{
                ranking.push(customer['customer'])
            })
            setCustomerTotalValueRanking(ranking)
        }
        dummy.current.scrollIntoView({behavior: "smooth"});
    },[totalValueOfOrder])

    useEffect(()=>{
        if(purchaseFrequencyAndTimeBetweenPurchases && chosenCustomer){
            const dates = []
            Object.keys(purchaseFrequencyAndTimeBetweenPurchases[chosenCustomer]).map((key)=>{
                dates.push(key)
            })
            const sortedDates = dates.sort((a, b) => new Date(a) - new Date(b));
            setStartDate(sortedDates[0])
            setEndDate(sortedDates[sortedDates.length-1])
        }
    },[chosenCustomer])
 
    return (
        <div ref={dummy} className=' w-full flex flex-col '>
            <div className=' w-full flex flex-col items-start justify-start gap-2'>
                <div className='h-1/10 w-full mt-4'>
                    <CustomerDropdown data={customerMonthlySales} setChosen={setChosenCustomer} customerTotalValueRanking={customerTotalValueRanking}/>
                </div>
                <div className='h-80per w-full '>
                    <CustomerTable data={customerMonthlySales} chosenCustomer={chosenCustomer} firestore={firestore} />
                </div>
                <div className='h-80per 3xs:h-mid w-full flex justify-center'>
                    <div className='flex-col 3xs:flex-row flex w-full xs:w-11/12 p-2 border-y-0 items-center justify-evenly bg-gradient-to-t from-stone-100 to-green-100 border-2 border-green-700 divide-y 3xs:divide-y-0 3xs:divide-x divide-green1'>
                        <div className='w-full 3xs:w-1/2 h-mid 3xs:h-full '>
                            <PurchaseFrequency data={purchaseFrequencyAndTimeBetweenPurchases} chosenCustomer={chosenCustomer} start={startDate} end={endDate}/>
                        </div>
                        <div className='w-full 3xs:w-1/2 h-mid 3xs:h-full '>
                            <TimeBetweenPurchases data={purchaseFrequencyAndTimeBetweenPurchases} chosenCustomer={chosenCustomer} start={startDate} end={endDate}/>
                        </div>
                    </div>
                </div>
                <div className='h-mid xs:h-80per w-full flex justify-center mb-3 overflow-x-auto'>
                    <TotalValueGraph data={totalValueOfOrder} chosenCustomer={chosenCustomer}/>
                </div>
            </div>
        </div>
    )
}

export default App