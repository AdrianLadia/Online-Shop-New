import React, {useState, useEffect,useContext} from 'react'
import NavBarBackButton from './NavBarBackButton'
import OrdersMessagesInfo from '../OrdersMessagesInfo'
import AppContext from '../../../../AppContext'

const NavBar = (messages) => {
 
    const ordersMessagesInfo = new OrdersMessagesInfo();
    const [first, setFirst] = useState("")
    const {selectedChatOrderId} = useContext(AppContext)
    // const [messageDetails, setMessageDetails] = useState([]);
    // const userId = messageDetails.find((s) => s.userId !== "Admin")?.userId;

  return (
    // <div className='flex justify-start mx-1 -mb-10 h-1/6 lg:-mb-12'>
    <div className='flex justify-center mx-1 h-1/10'>
        
        <div className='flex justify-start w-full h-full'>
            <div className='flex items-center h-full rounded-lg w-3/12 sm:w-2/12 md:w-1/12 '>
                <NavBarBackButton />
            </div>

            {/* <div className='flex self-center justify-center w-1/12 mr-2 text-2xl h-5/6 '>
                <div className='flex items-center justify-center w-20 h-full bg-red-200 rounded-full'><p>{userId[0].toUpperCase()}</p></div>
            </div> */}
            {/* ORDER REFERENCE : {selectedChatOrderId} */}
            
            <div className='flex items-center justify-start w-7/12 sm:w-5/12 '>
                <div className='mt-0.5 text-xl sm:text-2xl font-semibold text-white first-letter:uppercase '>ORDER REFERENCE : {selectedChatOrderId} </div>
            </div>
            
        </div>
    </div>
  )
}

export default NavBar