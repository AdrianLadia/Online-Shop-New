import React,{useState, useEffect} from 'react'
import OrdersMessagesInfo from '../OrdersMessagesInfo'
import DisplayMessagesUser from './DisplayMessagesUser';
import DisplayMessagesAdmin from './DisplayMessagesAdmin';

const DisplayMessages = (props) => {

  const ordersMessagesInfo = new OrdersMessagesInfo();
  // const [messageDetails, setMessageDetails] = useState([]);
  // console.log(props.messages)
  const messages = props.messages.messages
  const userName = props.userName
  const loggedInUserId = props.loggedInUserId

  // console.log(loggedInUserId)

  // useEffect(()=>{
  //     console.log(messages)
  //     if (messages != null) {
  //       const message = ordersMessagesInfo.getMessageDetails(messages); 
  //       console.log(message)
  //       setMessageDetails(message)
  //     }
  // },[messages])
 
  return (
    <div className='w-full bg-green4 border-color60 rounded-xl border-x-4 h-5/6'>
       <div className='h-full '>
          <div className='flex flex-col w-full h-full overflow-auto scrollbar-thumb-gray-500 scrollbar-track-gray-200 scrollbar-thin'>
              { messages ?
              messages.map((m, index)=>{
                console.log(m)
                const message = m.message
                const dateTime = m.dateTime
                const userRole = m.userRole
                if(m.userRole === "member"){
                  return <DisplayMessagesUser message={message} dateTime={dateTime} key={index} userName={userName}/>
                }else{
                  return <DisplayMessagesAdmin message={message} dateTime={dateTime} key={index} userRole={userRole}/>
                }
              }) : null}
          </div>
       </div>         
    </div>
  )
}

export default DisplayMessages