import React, { useEffect, useState, useContext } from 'react';
import InputField from './components/InputField';
import DisplayMessages from './components/DisplayMessages';
import NavBar from './components/NavBar';
import { doc, onSnapshot } from 'firebase/firestore';
import AppContext from '../../../AppContext';
import { useLocation } from 'react-router-dom';
import LoginButton from '../../LoginButton';
import { Typography } from '@mui/material';

const ChatApp = (props) => {
  const { db, selectedChatOrderId, setSelectedChatOrderId, userId, userdata, setRefreshUser, refreshUser, userstate,allUserData} =
    useContext(AppContext);
  const loggedInUserId = userId;
  const location = useLocation();
  const [orderRef, setOrderRef] = useState(null);
  const [isInquiryMessage, setIsInquiryMessage] = useState(null);
  // Checks if message is an inquiry message or not

  console.log(selectedChatOrderId)

  function getNameById(id) {
    console.log(id);
    if (allUserData == null) {
      return 'me';
    }
    const user = allUserData.find((user) => user.uid === id);
    if (user) {
      console.log(user.name);
      return user.name;
    }
    return 'new customer'; // or any default value you want to return if the user is not found
  }
  

  useEffect(() => {
    try {
      const { orderReference, isInquiry } = location.state;
      setOrderRef(orderReference)
      setIsInquiryMessage(true)
    } catch {
      setOrderRef(selectedChatOrderId)
      setIsInquiryMessage(false)
    }

  }, [selectedChatOrderId]);

  const [messageDetails, setMessageDetails] = useState({});
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState('');
  const chatData = props.chatData;
  const setChatData = props.setChatData;

  useEffect(() => {
    setRefreshUser(!refreshUser);
  }, []);

  useEffect(() => {
    
    if (userdata && userdata.userRole === 'member') {
      setUser(userdata.name);
      console.log('C')
      setSelectedChatOrderId(userId)
    }
  }, [userdata]);

  useEffect(() => {
   
    if (isInquiryMessage == false) {
      if (orderRef != null) {
        const docRef = doc(db, 'ordersMessages', orderRef);
        onSnapshot(docRef, (doc) => {
          if (doc.exists()) {
            let username 
            username = doc.data().ownerName;
            
            if (username == null) {
              username = getNameById(orderRef)
            }

            setMessageDetails(doc.data());
            setUserName(username);
            
          } else {
            console.log('No such document!');
          }
        });
      }
    }

    if (isInquiryMessage == true) {
      if (userdata != null) {
        const docRef = doc(db, 'ordersMessages', userId);
          onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
              const username = userdata.name;
              setMessageDetails(doc.data());
              setUserName(username);
              setOrderRef(selectedChatOrderId)
            } else {
              console.log('No such document!');
            }
          });
      }
    }

  }, [orderRef,userdata]);


  return (
    <>
      {userdata ? (
        // IF USER IS LOGGED IN
        <div className="flex justify-center w-screen h-screen  ">
          <div className="flex flex-col w-full h-full justify-evenly bg-color60 overflow-hidden">
            <NavBar messages={messageDetails} orderReferenceId={orderRef} />
            {messageDetails != {} ? (
              <DisplayMessages
                chatData={chatData}
                setChatData={setChatData}
                messages={messageDetails}
                userName={userName}
                loggedInUserId={loggedInUserId}
                user={user}
              />
            ) : null}
            <InputField loggedInUserId={loggedInUserId} orderReferenceId={orderRef} />
          </div>
        </div>
      ) : (
        // IF USER IS LOGGED OUT
        ((userstate == 'userloading') ? <div>loading</div>: 
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-color10c to-color60 text-white">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-3">Log in to message us</h1>
            <p className="text-xl">We are always here to help you. Log in now to start the conversation.</p>
          </div>
          <div className="mt-10">
            <LoginButton className="py-2 px-4 rounded bg-white text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-200" />
          </div>
        </div>)
      )}
    </>
  );
};

export default ChatApp;
