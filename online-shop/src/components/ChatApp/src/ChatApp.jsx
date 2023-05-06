import React, { useEffect, useState, useContext } from 'react';
import InputField from './components/InputField';
import DisplayMessages from './components/DisplayMessages';
import NavBar from './components/NavBar';
import { doc, onSnapshot } from 'firebase/firestore';
import AppContext from '../../../AppContext';

const ChatApp = () => {
  const {db, selectedChatOrderId, userId, firestore, chatSwitch, userdata } = useContext(AppContext);
  const loggedInUserId = userId;
  const [messageDetails, setMessageDetails] = useState({});
  const [userName, setUserName] = useState('');
  const user = userdata.name

  useEffect(() => {
    const docRef = doc(db, 'ordersMessages', selectedChatOrderId);
    onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const username = doc.data().ownerName;
        setMessageDetails(doc.data());
        setUserName(username);
      } else {
        console.log('No such document!');
      }
    });
  }, [chatSwitch]);

  // console.log(messageDetails)

  return (
    <div className="flex justify-center w-screen h-screen ">
      <div className="flex flex-col w-full h-full justify-evenly bg-color60">
        <NavBar messages={messageDetails} />

        {messageDetails != {} ? (
          <DisplayMessages messages={messageDetails} userName={userName} loggedInUserId={loggedInUserId} user={user}/>
        ) : null}

        <InputField loggedInUserId={loggedInUserId} />
      </div>
    </div>
  );
};

export default ChatApp;
