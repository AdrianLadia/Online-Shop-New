import React, {useState, useEffect, useContext} from 'react'
import NavBarBackButton from './NavBarBackButton'
import AppContext from '../../../../AppContext'

const NavBar = (props) => {
    const {selectedChatOrderId} = useContext(AppContext);
    const isInquiryMessage = props.isInquiryMessage;
    const backButtonRedirect = props.backButtonRedirect;
    console.log(backButtonRedirect)
    console.log(isInquiryMessage)

  return (
    <div className='flex justify-center mx-1 h-1/10'>
        <div className='flex justify-start w-full h-full'>
            <div className='flex items-center h-full rounded-lg w-36 lg:w-40'>
                <NavBarBackButton  backButtonRedirect={backButtonRedirect}/>
            </div>
            <div className='flex items-center justify-start -ml-10 sm:ml-0 w-7/12 sm:w-5/12 '>
                {isInquiryMessage ? null: <div className='mt-0.5 text-xl sm:text-2xl font-semibold text-white first-letter:uppercase '>ORDER REFERENCE : {selectedChatOrderId} </div> }
                
            </div>
        </div>
    </div>
  )
}

export default NavBar