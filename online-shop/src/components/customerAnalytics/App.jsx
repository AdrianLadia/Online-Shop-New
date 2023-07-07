import React, { useEffect, useState, useContext } from 'react';
import AppContext from "../../AppContext";
import CustomerDropdown from './CustomerDropdown';
import CustomerTable from './CustomerTable';
import PurchaseFrequency from './PurchaseFrequency';
import TimeBetweenPurchases from './TimeBetweenPurchases';
import TotalValueGraph from './TotalValueGraph';
import "./index.css"

const App = () => {
    const { firestore } = useContext(AppContext)
    const [ customerMonthlySales, setCustomerMonthlySales ] = useState({})
    const [ purchaseFrequencyAndTimeBetweenPurchases, setPurchaseFrequencyAndTimeBetweenPurchases] = useState({})
    const [ totalValueOfOrder, setTotalValueOfOrder ] = useState({})
    const [ chosenCustomer, setChosenCustomer ] = useState('')

    console.log(totalValueOfOrder)

    useEffect(()=>{
        firestore.readAllDataFromCollection('Analytics').then((data) => {
            setCustomerMonthlySales(data[0])
            setPurchaseFrequencyAndTimeBetweenPurchases(data[1])
            setTotalValueOfOrder(data[2])
        });
    },[])
 
    return (
        <div className=' w-full flex flex-col '>
            <div className=' w-full flex flex-col items-start justify-start gap-2'>
                <div className='h-1/10 w-full mt-4'>
                    <CustomerDropdown data={customerMonthlySales} setChosen={setChosenCustomer}/>
                </div>
                <div className='h-mid w-full '>
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