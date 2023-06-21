import React, {useContext} from 'react'
import { TiArrowLeftThick } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import AppContext from '../../../../AppContext';

const NavBarBackButton = (props) => {
  const backButtonRedirect = props.backButtonRedirect
  const navigateTo = useNavigate()
  const { isadmin, setChatSwitch,refreshUser,setRefreshUser} = useContext(AppContext);

  function onBackClick() {
    setRefreshUser(!refreshUser)
    if(isadmin){
      setChatSwitch(false)
    }else{  
      navigateTo(backButtonRedirect)
    }
  }

  return (
    <div className='flex items-center justify-start w-full h-full rounded-full'>
        {backButtonRedirect != null ?  
        <button
            onClick={onBackClick}
            className='flex items-center justify-center p-1 
                       text-3xl text-white bg-green5 rounded-full w-6/12 sm:w-8/12 md:h-5/6 h-4/6
                       md:text-4xl hover:bg-green3'
            >
            <TiArrowLeftThick/>
        </button>
        : null}
    </div>
  )
}

export default NavBarBackButton