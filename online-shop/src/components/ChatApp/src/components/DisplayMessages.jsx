import React, { useState, useEffect, useContext, useRef } from 'react';
import DisplayMessagesRight from './DisplayMessagesRight';
import DisplayMessagesLeft from './DisplayMessagesLeft';
import AppContext from '../../../../AppContext';
import { is } from 'date-fns/locale';
import { doc, getDoc } from 'firebase/firestore';
import db from '../firebase';
import dataManipulation from '../../../../../utils/dataManipulation';

const DisplayMessages = (props) => {
  const { chatSwitch, selectedChatOrderId,userdata,firestore } = useContext(AppContext);
  const messages = props.messages.messages;
  const userName = props.userName;
  const loggedInUserId = props.loggedInUserId;
  const user = props.user;
  const chatData = props.chatData;
  const setChatData = props.setChatData;
  const datamanipulation = new dataManipulation();

  const messagesRef = useRef(null);

  const scrollToBottom = () => {
    const messagesContainer = messagesRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  function isElementInView(elementId) {
    var element = document.getElementById(elementId);
    if (!element) {
      // Element with the given id not found
      return false;
    }
  
    var rect = element.getBoundingClientRect();
    var windowHeight = window.innerHeight || document.documentElement.clientHeight;
    var windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= windowHeight &&
      rect.right <= windowWidth
    );
  }
 

  async function markMessagesAsReadAsOwner() {
    const docRef = doc(db, 'ordersMessages', selectedChatOrderId);
    console.log(selectedChatOrderId);

    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    console.log(data);
    const messages = data.messages;

    let unreadOwner = 0;
    let unreadAdmin = 0;

    messages.map((mess) => {
      // console.log(mess);
      if (mess.userRole != 'member' && loggedInUserId !== mess.userId) {
        // console.log(mess.dateTime)
        const id = datamanipulation.convertDateTimeStampToDateString(mess.dateTime)
        console.log(id)
        if (isElementInView(id)) {
          console.log('found');
          mess.read = true;
        }
      }

      if (mess.userRole === 'member' && mess.read === false) {
        unreadOwner += 1;
      }

      if (mess.userRole != 'member' && mess.read === false) {
        unreadAdmin += 1;
      }
    });
    if (unreadAdmin === 0) {
      await firestore.updateOrderMessageMarkAsAdminReadAll(selectedChatOrderId, true);
    } 

    if (userdata.userRole != 'member') {
      if (data.adminReadAll === true) {
        const newChatData = chatData.filter((chat) => chat.id != selectedChatOrderId);
        setChatData(newChatData);
      }
    }    

    console.log(messages)

    firestore.updateOrderMessageAsRead(selectedChatOrderId, messages);
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log('triggered');
    markMessagesAsReadAsOwner();
  }, [messages]);

  return (
    <div className="w-full bg-green4 border-color60 rounded-xl border-x-4 h-5/6">
      <div className="h-full ">
        <div
          ref={messagesRef}
          className="flex flex-col w-full h-full overflow-auto scrollbar-thumb-gray-500 scrollbar-track-gray-200 scrollbar-thin"
        >
          {messages
            ? messages.map((m, index) => {
                const message = m.message;
                const dateTime = m.dateTime;
                const userRole = m.userRole;
                const read = m.read;
                const image = m.image;

                if (m.userId === loggedInUserId) {
                  return (
                    <DisplayMessagesRight
                      message={message}
                      dateTime={dateTime}
                      user={user}
                      userName={userName}
                      read={read}
                      loggedInUserId={loggedInUserId}
                      image={image}
                    />
                  );
                } else {
                  return (
                    <DisplayMessagesLeft
                      chatData={chatData}
                      setChatData={setChatData}
                      message={message}
                      dateTime={dateTime}
                      userName={userName}
                      user={user}
                      read={read}
                      userRole={userRole}
                      loggedInUserId={loggedInUserId}
                      image={image}
                    />
                  );
                }
              })
            : null}
        </div>
      </div>
    </div>
  );
};

export default DisplayMessages;
