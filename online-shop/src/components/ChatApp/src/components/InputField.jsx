import React, { useContext, useEffect, useState } from 'react'
import InputBox from './InputFieldBox'
import InputSendButton from './InputFieldButton'
import { doc, updateDoc,  arrayUnion, Timestamp  } from "firebase/firestore"; 
import AppContext from '../../../../AppContext';

import db from"../firebase"

const InputField = () => {

  const [message, setMessage] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [send, setSend] = useState(null);
  const date = new Date();
  const timestamp = Timestamp.fromDate(date);
  const timestampString = timestamp.toDate().toLocaleString();
  const {userId,selectedChatOrderId,userdata} = useContext(AppContext)

    async function sendMessages(){
      // console.log(message)
      // console.log(newMessage)
      const docRef = doc(db, "ordersMessages", selectedChatOrderId);
        // Add data to the array field
        if(newMessage){
          updateDoc(docRef, {
          messages: arrayUnion({ 
            // add a new map object to the array field
            message: newMessage,
            userId: userId,
            dateTime: timestampString,
            userRole : userdata.userRole,
            read : false
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
      if(send){
        // setNewMessage(message)
        // console.log(newMessage)
        // setMessage("")
        // setNewMessage("")
        // sendMessages()
      }
    },[send])

    function inputMessage(option1, option2){
      setMessage(option1)
      setSend(option2)
      console.log(option2)
      if(option2 === true){
        setNewMessage(message)
        sendMessages()
      }
    }
  
    function sendMessage(option1){
      setSend(option1)
      if(option1===true){
        setNewMessage(message)
        setMessage("")
        sendMessages()
      }
    }

    // console.log(send)

  return (
    // <div className="flex flex-col justify-end w-full -mt-8 lg:-mt-9 h-1/6">
    <div className="flex flex-col justify-end w-full h-1/10">
      <div className='w-full h-full'>
        <div className='flex items-center w-full h-full rounded-lg'>
            <InputBox callback={inputMessage} sent={send}/>
            <InputSendButton callback={sendMessage} />
        </div>
      </div>
    </div>
  )
}

export default InputField