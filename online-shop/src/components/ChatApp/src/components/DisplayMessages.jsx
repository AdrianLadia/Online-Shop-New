import React,{useState, useEffect, useContext, useRef} from 'react'
import DisplayMessagesUser from './DisplayMessagesUser';
import DisplayMessagesAdmin from './DisplayMessagesAdmin';
import AppContext from '../../../../AppContext';

const DisplayMessages = (props) => {

  const { isadmin, chatSwitch } = useContext(AppContext);
  const messages = props.messages.messages
  const userName = props.userName
  const loggedInUserId = props.loggedInUserId
  const user = props.user;

  useEffect(()=>{

  },[chatSwitch])

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
                  return <DisplayMessagesUser message={message} dateTime={dateTime} user={user} userName={userName} read={read} loggedInUserId={loggedInUserId}/>
                }else{
                  return <DisplayMessagesAdmin message={message} dateTime={dateTime} userName={userName} user={user} read={read} userRole={userRole} loggedInUserId={loggedInUserId}/>
                }
              }) : null}
          </div>
       </div>  
    </div>
  )
}

export default DisplayMessages