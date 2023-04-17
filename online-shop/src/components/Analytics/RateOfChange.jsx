import React, {useEffect, useState} from 'react'
import businessCalculation from './bussinessCalculation/businessCalculation';

export const RateOfChange = ({data, number}) => {

    const businesscalculation = new businessCalculation();  
    const [averageSales, setAverageSales] = useState(0);
    // console.log(data.itemName)
    
    useEffect(()=>{
      if(number){ 
          const sales = businesscalculation.getRateOfChange(data.salesPerMonth, number);
          // console.log(sales)
          if(sales === null){
            setAverageSales(0)
          }else if (typeof sales === "number"){
            setAverageSales(sales.toFixed(2))
          }else{
            setAverageSales(0)
          }typeof sales === "number"
        }
    },[])

  return (
    <div>
        { 
         (averageSales+ '%')
        }
    </div>
  )
}
