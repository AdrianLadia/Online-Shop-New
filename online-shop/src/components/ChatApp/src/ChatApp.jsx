import React, { useEffect, useState, useContext } from 'react';
import InputField from './components/InputField';
import DisplayMessages from './components/DisplayMessages';
import NavBar from './components/NavBar';
import { doc, onSnapshot } from 'firebase/firestore';
import AppContext from '../../../AppContext';
import { useLocation } from 'react-router-dom';

const ChatApp = () => {
  const {db, selectedChatOrderId, userId, userdata ,setRefreshUser,refreshUser} = useContext(AppContext);
  const loggedInUserId = userId;
  const location = useLocation();
  let orderRef
  try{
    const {orderReference} = location.state
    orderRef = orderReference
    console.log('ran user')
  }
  catch{
    orderRef = selectedChatOrderId
    console.log('ran admin')
  }
  const [messageDetails, setMessageDetails] = useState({});
  const [userName, setUserName] = useState('');
  const [user,setUser] = useState('')

  useEffect(()=>{
    setRefreshUser(!refreshUser)
    console.log(orderRef)
  },[])

  useEffect(()=>{
    if (userdata) {
      setUser(userdata.name)
    }
  },[userdata])
  
  useEffect(() => {
    if (orderRef != null) {
      console.log(orderRef)
      const docRef = doc(db, 'ordersMessages', orderRef);
      onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const username = doc.data().ownerName;
          setMessageDetails(doc.data());
          setUserName(username);
        } else {
          console.log('No such document!');
        }
      });
    }
  }, [selectedChatOrderId]);

  return (
    <div className="flex justify-center w-screen h-screen ">
      <div className="flex flex-col w-full h-full justify-evenly bg-color60">
        <NavBar messages={messageDetails} orderReferenceId={orderRef}/>

        {messageDetails != {} ? (
          <DisplayMessages messages={messageDetails} userName={userName} loggedInUserId={loggedInUserId} user={user}/>
        ) : null}

        <InputField loggedInUserId={loggedInUserId} orderReferenceId={orderRef} />
      </div>
    </div>
  );
};

export default ChatApp;
