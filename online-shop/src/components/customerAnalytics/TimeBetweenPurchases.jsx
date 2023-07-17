import React, {useState, useEffect} from 'react'
import businessCalculation from './businessCalculation'

const TimeBetweenPurchases = ({data, chosenCustomer, start, end}) => {
  const businesscalculation = new businessCalculation()
  const [ averageInterval, setAverageInterval ] = useState("Click Submit")
  const [ startDate, setStartDate ] = useState('')
  const [ endDate, setEndDate ] = useState('')

  useEffect(()=>{
    if(chosenCustomer){
        setStartDate(start)
        setEndDate(end)
        setAverageInterval(businesscalculation.getAverageTimeBetweenPurchases(data, chosenCustomer, start, end))
    }else{
        setStartDate('')
        setEndDate('')
        setAverageInterval('Select a Customer')
    }
  },[start, end, chosenCustomer])

  function handleClick(){
    if(chosenCustomer == '' || chosenCustomer == null){
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
            setAverageInterval('No Interval')
        }else{
            setAverageInterval(averageTime)
        }
    }else{
        setAverageInterval('Invalid Input')
    }
  }

  function inputStyle(){
    return 'w-11/12 lg:w-full focus:border-red-200 border border-red-300 outline-none p-2 rounded-lg font-normal '
  }

return (
  <div className='h-full w-full'>
      <div className='h-full w-full rounded-xl  '>
          <div className='h-6/10 lg:h-4/10 '>
              <div className='p-5 flex-col lg:flex-row h-3/4 flex items-center justify-evenly text-slate-500 font-semibold'>
                  <div className='ml-2 lg:ml-0'><label for="tstart">Start Date:</label> <input value={startDate} id='tstart' className={inputStyle()} onChange={(e)=>{setStartDate(e.target.value)}} type='date' /></div>
                  <div className='ml-2 lg:ml-0'><label for="tend">End Date:</label> <input value={endDate} id='tend' className={inputStyle()} onChange={(e)=>{setEndDate(e.target.value)}} type='date' /></div>
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