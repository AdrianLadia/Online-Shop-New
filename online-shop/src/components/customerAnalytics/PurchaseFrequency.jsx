import React, {useState, useEffect} from 'react'
import businessCalculation from './businessCalculation'

const PurchaseFrequency = ({data, chosenCustomer}) => {
    const businesscalculation = new businessCalculation()
    const [ purchaseFrequency, setPurchaseFrequency ] = useState("0 purchase(s)")
    const [ startDate, setStartDate ] = useState('')
    const [ endDate, setEndDate ] = useState('')

    function handleClick(){
        if(chosenCustomer == ''){
            setPurchaseFrequency('Select a Customer')
        }else if(endDate == '' && startDate == ''){
            setPurchaseFrequency('Enter Start & End Date')
        }else if(startDate == ''){
            setPurchaseFrequency('Enter Start Date')
        }else if(endDate == ''){
            setPurchaseFrequency('Enter End Date')
        }else if(chosenCustomer != '' && startDate.length == 10 && endDate.length == 10){
            const frequency = businesscalculation.getPurchaseFrequency(data, chosenCustomer, startDate, endDate)
            if(frequency == undefined){
                setPurchaseFrequency('No Result')
            }else{
                setPurchaseFrequency(frequency)
            }
        }else{
            setPurchaseFrequency('Invalid Input')
        }
    }

    function inputStyle(){
        return 'w-11/12 lg:w-full focus:border-red-400 border border-red-100 outline-none p-2 rounded-lg font-normal'
    }

  return (
    <div className='h-full w-full'>
        <div className='h-full w-full rounded-lg  '>
            <div className='h-6/10 lg:h-4/10 '>
                <div className='flex-col lg:flex-row flex h-3/4 items-center justify-evenly text-slate-500 font-semibold'>
                    <div className='ml-2 lg:ml-0'><h1>Start Date:</h1> <input className={inputStyle()} value={startDate} onChange={(e)=>{setStartDate(e.target.value)}} type='text' placeholder='yyyy-mm-dd'/></div>
                    <div className='ml-2 lg:ml-0'><h1>End Date:</h1> <input className={inputStyle()} value={endDate} onChange={(e)=>{setEndDate(e.target.value)}} type='text' placeholder='yyyy-mm-dd'/></div>
                </div>
                <div className='mt-1 lg:mt-0 h-1/4 flex justify-center items-start '>
                    <button onClick={handleClick} type='button' className='p-1 md:p-2 px-3 border border-white text-white rounded-xl  bg-red-500 hover:bg-red-300'> Submit </button>
                </div>
            </div>
            <div className=' h-4/10 lg:h-6/10 flex flex-col justify-evenly items-center'>
                <div className='h-1/2 lg:h-4/10 text-slate-500 flex items-center '>
                    Purchase Frequency:
                </div>
                <div className='h-1/2 lg:h-6/10 text-base md:text-2xl font-bold flex items-start'>
                    {purchaseFrequency}
                </div>
            </div>
        </div>
    </div>
  )
}

export default PurchaseFrequency