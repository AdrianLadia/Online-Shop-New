import React, { useEffect, useState, useContext } from 'react';
import InputField from './components/InputField';
import DisplayMessages from './components/DisplayMessages';
import NavBar from './components/NavBar';
import { doc, onSnapshot } from 'firebase/firestore';
import AppContext from '../../../AppContext';
import { useLocation } from 'react-router-dom';
import LoginButton from '../../LoginButton';
import { Typography } from '@mui/material';
import { is } from 'date-fns/locale';

const ChatApp = (props) => {
  const {
    db,
    selectedChatOrderId,
    setSelectedChatOrderId,
    userId,
    userdata,
    setRefreshUser,
    refreshUser,
    userstate,
    allUserData,
    firestore,
  } = useContext(AppContext);
  const location = useLocation();
  const setChatData = props.setChatData;
  const chatData = props.chatData;
  const [messageDetails, setMessageDetails] = useState({});
  const [isInquiryMessage, setIsInquiryMessage] = useState(false);
  const [backButtonRedirect, setBackButtonRedirect] = useState(null);
  const [fromHomePage, setFromHomePage] = useState(false);
  // There are 2 states of mounting this component one is using navigateTo and
  // other is using the component ChatApp directly
  useEffect(() => {
    try {
      const { orderReference, isInquiry, backButtonRedirect,fromHomePage } = location.state;
      console.log(fromHomePage)
      if (fromHomePage) {
        setIsInquiryMessage(isInquiry);
        setBackButtonRedirect(backButtonRedirect);
        setFromHomePage(true);
        
      }
      else {
        console.log(orderReference);
        setSelectedChatOrderId(orderReference);
        setIsInquiryMessage(isInquiry);
        setBackButtonRedirect(backButtonRedirect);
      }
    } catch {
     
      setIsInquiryMessage(false);
    }
  }, []);

  useEffect(() => {
    // if (fromHomePage) {
    if(userdata) {
      setSelectedChatOrderId(userdata.uid)
    }
    // }
  }, [userdata]);

  useEffect(() => {
    console.log(selectedChatOrderId);
    if (selectedChatOrderId != null) {
      const docRef = doc(db, 'ordersMessages', selectedChatOrderId);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setMessageDetails(doc.data());
        } else {
          console.log('No such document!');
        }
      });
    }
  }, [selectedChatOrderId]);

  return (
    <>
      {userdata ? (
        // IF USER IS LOGGED IN
        <div className="flex justify-center w-screen h-screen  ">
          <div className="flex flex-col w-full h-full justify-evenly bg-color60 overflow-hidden">
            <NavBar
              messages={messageDetails}
              isInquiryMessage={isInquiryMessage}
              backButtonRedirect={backButtonRedirect}
            />
            {messageDetails != {} ? (
              <DisplayMessages chatData={chatData} setChatData={setChatData} messageDetails={messageDetails} />
            ) : null}
            <InputField />
          </div>
        </div>
      ) : // IF USER IS LOGGED OUT
      userstate == 'userloading' ? (
        <div>loading</div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-color10c to-color60 text-white">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-3">Log in to message us</h1>
            <p className="text-xl">We are always here to help you. Log in now to start the conversation.</p>
          </div>
          <div className="mt-10">
            <LoginButton className="py-2 px-4 rounded bg-white text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-200" />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatApp;
