import React, { useContext, useEffect, useState } from 'react'
import InputBox from './InputFieldBox'
import InputSendButton from './InputFieldButton'
import { doc, updateDoc, arrayUnion, Timestamp, getDoc, getDocs} from "firebase/firestore"; 
import AppContext from '../../../../AppContext';
import db from"../firebase"

const InputField = (props) => {

  const loggedInUserId = props.loggedInUserId;
  const [message, setMessage] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [send, setSend] = useState(false);
  const date = new Date();
  const timestamp = Timestamp.fromDate(date);
  const timestampString = timestamp.toDate().toLocaleString();
  const {userId, selectedChatOrderId, userdata, firestore} = useContext(AppContext)

    async function updateMessages(){
      const docRef = doc(db, "ordersMessages", selectedChatOrderId);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      const messages = data.messages;

      let unreadAdmin = 0; 
      let unreadOwner = 0;
        messages.map((mess)=>{ 
        
        if (mess.userRole !== 'member' &&  loggedInUserId !== mess.userId) {
            mess.read = true;
        }

          if(mess.read === false && mess.userRole != "member"){
            unreadAdmin += 1;
          }
          if(mess.read === false && mess.userRole === "member"){
            unreadOwner += 1;
          }
        })
        
        if(unreadAdmin === 0){
          data.adminReadAll = true;
        }else{
          data.adminReadAll = false;
        }

        if(unreadOwner === 0){
          data.ownerReadAll = true;
        }else{
          data.ownerReadAll = false;
        }
        // console.log(data.adminReadAll)
      firestore.updateOrderMessageMarkAsOwnerReadAll(selectedChatOrderId, data.ownerReadAll)
      firestore.updateOrderMessageMarkAsAdminReadAll(selectedChatOrderId, data.adminReadAll)
      firestore.updateOrderMessageAsRead(selectedChatOrderId, messages)
    }

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

    function inputMessage(option1, option2){
      setMessage(option1)
      setSend(option2)
      // console.log(option2)
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

    useEffect(()=>{
      updateMessages()
    },[send])

  return (
    // <div className="flex flex-col justify-end w-full -mt-8 lg:-mt-9 h-1/6">
    <div className="flex flex-col justify-end w-full h-1/10">
      <div className='w-full h-full'>
        <div className='flex items-center w-full h-full rounded-lg'>
            {/* <button onClick={sample}>Sample</button> */}
            <InputBox callback={inputMessage} sent={send}/>
            <InputSendButton callback={sendMessage} />
        </div>
      </div>
    </div>
  )
}

export default InputField


