import React, { useEffect, useState,useContext} from 'react'
import InputField from './components/InputField'
import DisplayMessages from './components/DisplayMessages'
import "./App.css"
import NavBar from './components/NavBar'
// import db from"./firebase"
import { doc, onSnapshot } from "firebase/firestore"; 
import AppContext from '../../../AppContext'

const ChatApp = () => {

  const {db,selectedChatOrderId, setSelectedChatOrderId,userId} = useContext(AppContext)

  const loggedInUserId = userId

  // console.log(loggedInUserId)

  const orderData = {
    reference : 'testref12',
    userId : 'PN4JqXrjsGfTsCUEEmaR5NO6rNF3',
  }

  const [messageDetails, setMessageDetails] = useState({});
  const [userName,setUserName] = useState('')

  console.log(selectedChatOrderId)
  
  async function getData(){
    const docRef = doc(db, "ordersMessages", selectedChatOrderId);
      onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          console.log(doc.data())
          const username = doc.data().ownerName
          setMessageDetails(doc.data())
          setUserName(username)
        } else {
            console.log("No such document!");
        }
    });
  }
    
  useEffect(()=>{
    getData()
  },[])

  
  return (
    <div className='flex justify-center w-screen h-screen '>
      
      <div className='flex flex-col w-full h-full bg-indigo-300 justify-evenly'>
        <NavBar messages={messageDetails}/>
        {(messageDetails != {}) ? 
          <DisplayMessages messages={messageDetails} userName={userName} loggedInUserId={loggedInUserId}/>
        : null }
        <InputField />  
      </div>
    </div>
  )
}

export default ChatApp