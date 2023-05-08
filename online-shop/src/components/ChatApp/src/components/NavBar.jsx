import React, {useState, useEffect, useContext} from 'react'
import NavBarBackButton from './NavBarBackButton'
import AppContext from '../../../../AppContext'

const NavBar = () => {
 
    const {selectedChatOrderId} = useContext(AppContext)

  return (
    <div className='flex justify-center mx-1 h-1/10'>
        <div className='flex justify-start w-full h-full'>
            <div className='flex items-center h-full rounded-lg w-3/12 sm:w-2/12 md:w-1/12 '>
                <NavBarBackButton />
            </div>
            <div className='flex items-center justify-start w-7/12 sm:w-5/12 '>
                <div className='mt-0.5 text-xl sm:text-2xl font-semibold text-white first-letter:uppercase '>ORDER REFERENCE : {selectedChatOrderId} </div>
            </div>
        </div>
    </div>
  )
}

export default NavBar