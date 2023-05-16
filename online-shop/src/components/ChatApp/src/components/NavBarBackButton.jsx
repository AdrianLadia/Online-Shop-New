import React, {useContext} from 'react'
import { TiArrowLeftThick } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import AppContext from '../../../../AppContext';

const NavBarBackButton = () => {

  const navigateTo = useNavigate()
  const { isadmin, setChatSwitch} = useContext(AppContext);

  function onBackClick() {
    if(isadmin){
      setChatSwitch(false)
      // navigateTo("/myorders/orderList")
    }else{  
      navigateTo("/myorders/orderList")
    }
  }

  return (
    <div className='flex items-center justify-start w-full h-full rounded-full'>
        <button
            onClick={onBackClick}
            className='flex items-center justify-center p-1 
                       text-3xl text-white bg-green5 rounded-full w-6/12 sm:w-8/12 md:h-5/6 h-4/6
                       md:text-4xl hover:bg-green3'
            >
            <TiArrowLeftThick/>
        </button>
    </div>
  )
}

export default NavBarBackButton