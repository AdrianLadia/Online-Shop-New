import React, {useState, useEffect} from 'react'
import businessCalculation from './businessCalculation'

const TimeBetweenPurchases = ({data, chosenCustomer}) => {
  const businesscalculation = new businessCalculation()
  const [ averageInterval, setAverageInterval ] = useState('0 day(s)')
  const [ startDate, setStartDate ] = useState('')
  const [ endDate, setEndDate ] = useState('')

  function handleClick(){
    if(chosenCustomer == ''){
        setAverageInterval('Select a Customer')
    }else if(endDate == '' && startDate == ''){
        setAverageInterval('Enter Start & End Date')
    }else if(startDate == ''){
        setAverageInterval('Enter Start Date')
    }else if(endDate == ''){
        setAverageInterval('Enter End Date')
    }else if(chosenCustomer != '' && startDate.length == 10 && endDate.length == 10){
        const averageTime = businesscalculation.getAverageTimeBetweenPurchases(data, chosenCustomer, startDate, endDate)
        if(averageTime == undefined){
            setAverageInterval('No Result')
        }else{
            setAverageInterval(averageTime)
        }
    }else{
        setAverageInterval('Invalid Input')
    }
  }

  function inputStyle(){
    return 'w-11/12 lg:w-full focus:border-red-400 border border-red-100 outline-none p-2 rounded-lg font-normal'
  }

return (
  <div className='h-full w-full'>
      <div className='h-full w-full rounded-xl  '>
          <div className='h-6/10 lg:h-4/10 '>
              <div className=' flex-col lg:flex-row h-3/4 flex items-center justify-evenly text-slate-500 font-semibold'>
                  <div className='ml-2 lg:ml-0'><h1>Start Date:</h1> <input value={startDate} className={inputStyle()} onChange={(e)=>{setStartDate(e.target.value)}} type='text' placeholder='yyyy-mm-dd'/></div>
                  <div className='ml-2 lg:ml-0'><h1>End Date:</h1> <input value={endDate} className={inputStyle()} onChange={(e)=>{setEndDate(e.target.value)}} type='text' placeholder='yyyy-mm-dd'/></div>
              </div>
              <div className='mt-1 lg:mt-0 h-1/4 flex justify-center items-start '>
                  <button onClick={handleClick} type='button' className='p-1 md:p-2 px-3 border border-white text-white rounded-xl  bg-red-500 hover:bg-red-300'> Submit </button>
              </div>
          </div>
          <div className='h-4/10 lg:h-6/10 flex flex-col justify-evenly items-center'>
              <div className='ml-1.5 md:ml-0 h-1/2 lg:h-4/10 text-slate-500 flex items-center'>
                  Purchase Interval:
              </div>
              <div className='h-1/2 lg:h-6/10 text-base md:text-2xl font-bold flex items-start'>
                  {averageInterval}
              </div>
          </div>
      </div>
  </div>
)
}

export default TimeBetweenPurchases