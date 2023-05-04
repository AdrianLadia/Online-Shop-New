import React from 'react'
import { TiArrowLeftThick } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
// /myorders/orderList

const NavBarBackButton = () => {

  const navigateTo = useNavigate()

  function onBackClick() {
    navigateTo("/myorders/orderList")
  }

  return (
    <div className='flex items-center justify-start w-full h-full rounded-full'>
        <button
            onClick={onBackClick}
            className='flex items-center justify-center w-6/12 p-1 
                       text-3xl text-white bg-green5 rounded-full sm:w-8/12 md:h-5/6 h-4/6
                       md:text-4xl hover:bg-green3'
            >
            <TiArrowLeftThick/>
        </button>
    </div>
  )
}

export default NavBarBackButton