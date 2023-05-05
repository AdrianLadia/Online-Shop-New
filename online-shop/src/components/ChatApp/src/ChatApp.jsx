import React, { useEffect, useState, useContext } from 'react';
import InputField from './components/InputField';
import DisplayMessages from './components/DisplayMessages';
import NavBar from './components/NavBar';
import { doc, onSnapshot } from 'firebase/firestore';
import AppContext from '../../../AppContext';

const ChatApp = () => {
  const {db, selectedChatOrderId, setSelectedChatOrderId, userId, firestore, chatSwitch } = useContext(AppContext);
  const loggedInUserId = userId;
  const [messageDetails, setMessageDetails] = useState({});
  const [userName, setUserName] = useState('');

  async function getData() {
    console.log(selectedChatOrderId)
    const data = await firestore.readOrderMessageByReference(selectedChatOrderId);

    if (data !== null) {
      const username = data.ownerName;
      setMessageDetails(data);
      setUserName(username);
    } else {
      console.log('No such document!');
    }
  }

  // console.log(selectedChatOrderId)

  useEffect(() => {
    // console.log('ran')
    const docRef = doc(db, 'ordersMessages', selectedChatOrderId);
    onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        // console.log(doc.data());
        const username = doc.data().ownerName;
        setMessageDetails(doc.data());
        setUserName(username);
      } else {
        console.log('No such document!');
      }
    });
  }, [chatSwitch]);


  return (
    <div className="flex justify-center w-screen h-screen ">
      <div className="flex flex-col w-full h-full justify-evenly bg-color60">
        <NavBar messages={messageDetails} />

        {messageDetails != {} ? (
          <DisplayMessages messages={messageDetails} userName={userName} loggedInUserId={loggedInUserId} />
        ) : null}

        <InputField loggedInUserId={loggedInUserId} />
      </div>
    </div>
  );
};

export default ChatApp;
