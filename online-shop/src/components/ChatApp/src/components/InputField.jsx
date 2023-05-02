import React, { useContext, useEffect, useState } from 'react'
import InputBox from './InputFieldBox'
import InputSendButton from './InputFieldButton'
import { doc, updateDoc,  arrayUnion, Timestamp  } from "firebase/firestore"; 
import AppContext from '../../../../AppContext';

import db from"../firebase"

const InputField = () => {

  const [message, setMessage] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [send, setSend] = useState(false);
  const date = new Date();
  const timestamp = Timestamp.fromDate(date);
  const timestampString = timestamp.toDate().toLocaleString();
  const {userId,selectedChatOrderId,userdata} = useContext(AppContext)

    async function sendMessages(){
      const docRef = doc(db, "ordersMessages", selectedChatOrderId);
        // Add data to the array field
        if(newMessage){
          updateDoc(docRef, {
          messages: arrayUnion({ 
            // add a new map object to the array field
            message: newMessage,
            userId: userId,
            dateTime: timestampString,
            userRole : userdata.userRole
          }),
          }).then(() => {
            console.log("Message is sent Successfuly: ", newMessage);
            setMessage("")
            setNewMessage("")
          }).catch((error) => {
            console.error("Error adding data to the array field: ", error);
            setMessage("")
            setNewMessage("")
          });
      }
    }

    useEffect(()=>{
      if(send===true){
        setSend(false)
        setMessage("")
        setNewMessage("")
        setNewMessage(message)
        sendMessages()
      }
    },[send])

    function inputMessage(option1){
      setMessage(option1)
    }
  
    function sendMessage(option1){
      setSend(option1)
      // console.log(send)
    }

  return (
    // <div className="flex flex-col justify-end w-full -mt-8 lg:-mt-9 h-1/6">
    <div className="flex flex-col justify-end w-full h-1/10">
      <div className='w-full h-full'>
        <div className='flex items-center w-full h-full rounded-lg'>
            <InputBox callback={inputMessage} sent={send}/>
            <InputSendButton callback={sendMessage}/>
        </div>
      </div>
    </div>
  )
}

export default InputField