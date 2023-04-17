import React, {useEffect, useState} from 'react'
import businessCalculation from './bussinessCalculation/businessCalculation';

export const SimpleMovingAverage = ({data, number}) => {

    const businesscalculation = new businessCalculation();  
    const [averageSales, setAverageSales] = useState([]);
    
    useEffect(()=>{
      if(number){ 
          const sales = businesscalculation.getSimpleMovingAverage(data.salesPerMonth, number);
          if(sales === null){
            setAverageSales(0)
          }else{
            setAverageSales(sales.toFixed(3))
          }
        }
    },[])

  return (
    <div>
       {averageSales}
    </div>
  )
}
