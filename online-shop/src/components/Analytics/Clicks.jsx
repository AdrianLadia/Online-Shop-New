import React, {useEffect, useState} from 'react'
import businessCalculation from './bussinessCalculation/businessCalculation';

export const Clicks = ({data, number}) => {
 
    const businesscalculation = new businessCalculation();
    const [averageClicks, setAverageClicks] = useState(0);

    useEffect(()=>{
        if(number){
            if(data.clicks){
                const totalClicks = data.clicks.length;
                const ave = businesscalculation.getClicks(totalClicks, number);
                if(typeof ave == "number" ){
                    setAverageClicks(ave.toFixed(2));
                }
            }else{
                setAverageClicks(0);
            };
        }
    },[])

  return (
    <div >
        { (averageClicks) }
    </div>
  )
}
