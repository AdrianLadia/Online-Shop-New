import React from 'react'
import { TiArrowLeftThick } from "react-icons/ti";

const NavBarBackButton = () => {

  return (
    <div className='flex items-center justify-start w-full h-full rounded-full'>
        <button
            className='flex items-center justify-center w-6/12 p-1 text-3xl text-white bg-indigo-500 rounded-full sm:w-8/12 md:h-5/6 h-4/6 md:text-4xl hover:bg-indigo-400'
            >
            <TiArrowLeftThick/>
        </button>
    </div>
  )
}

export default NavBarBackButton