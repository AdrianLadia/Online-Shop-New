import React, {useState, useEffect,useContext} from 'react'
import NavBarBackButton from './NavBarBackButton'
import OrdersMessagesInfo from '../OrdersMessagesInfo'
import AppContext from '../../../../AppContext'

const NavBar = (messages) => {
 
    const ordersMessagesInfo = new OrdersMessagesInfo();
    // const [messageDetails, setMessageDetails] = useState([]);
    const [first, setFirst] = useState("")
    // const userId = messageDetails.find((s) => s.userId !== "Admin")?.userId;
    const {selectedChatOrderId} = useContext(AppContext)
    
    
    // useEffect(()=>{
    //     const message = ordersMessagesInfo.getMessageDetails(messages); 
    //     setMessageDetails(message) 
    // },[messages])

    // useEffect(()=>{
    //     // setFirst(userId[0])
    // },[userId])

  return (
    // <div className='flex justify-start mx-1 -mb-10 h-1/6 lg:-mb-12'>
    <div className='flex justify-center mx-1 h-1/10'>
        
        <div className='flex justify-start w-full h-full'>
            <div className='flex items-center w-3/12 h-full rounded-lg sm:w-2/12 md:w-1/12'>
                <NavBarBackButton />
            </div>

            {/* <div className='flex self-center justify-center w-1/12 mr-2 text-2xl h-5/6 '>
                <div className='flex items-center justify-center w-20 h-full bg-red-200 rounded-full'><p>{userId[0].toUpperCase()}</p></div>
            </div> */}
            {/* ORDER REFERENCE : {selectedChatOrderId} */}
            
            <div className='flex items-center justify-center w-7/12 sm:w-5/12'>
                <div className='mt-0.5 text-xl sm:text-2xl font-bold text-indigo-700 first-letter:uppercase '>ORDER REFERENCE : {selectedChatOrderId} </div>
                {/* <div className='flex items-center justify-center w-1/2 text-2xl font-bold text-white uppercase bg-indigo-400 border-8 border-indigo-500 rounded-full h-5/6'
                >{first}</div> */}
            </div>
            
        </div>
    </div>
  )
}

export default NavBar