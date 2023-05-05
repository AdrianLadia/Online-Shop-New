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


  // alert(loggedInUserId)


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
                const message = m.message
                const dateTime = m.dateTime
                const userRole = m.userRole
                const read = m.read
                if(m.userId === loggedInUserId){
                  return <DisplayMessagesUser message={message} dateTime={dateTime} userRole={userRole} loggedInUserId={loggedInUserId}/>
                }else{
                  return <DisplayMessagesAdmin message={message} dateTime={dateTime} userName={userName} read={read} userRole={userRole} loggedInUserId={loggedInUserId}/>
                }
              }) : null}
          </div>
       </div>         
    </div>
  )
}

export default DisplayMessages