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
  const messages = props.messageDetails.messages;
  const leftNameIfMemberIsOnRight = props.messageDetails.ownerName;
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
 

  async function markMessagesAsRead() {
    console.log(selectedChatOrderId)
    const docRef = doc(db, 'ordersMessages', selectedChatOrderId);
    console.log(selectedChatOrderId);

    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    console.log(data);
    const messages = data.messages;

    let unreadOwner = 0;
    let unreadAdmin = 0;

    messages.map((mess) => {
      if (mess.userRole != 'member' && userdata.uid !== mess.userId) {
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

    if (userdata.userRole != 'member') {
      if (data.ownerReadAll === true) {
        const newChatData = chatData.filter((chat) => chat.id != selectedChatOrderId);
        setChatData(newChatData);
      }
    }    
    firestore.updateOrderMessageAsRead(selectedChatOrderId, messages);

    console.log('unreadOwner',unreadOwner);
    console.log('unreadAdmin',unreadAdmin);

    if (unreadOwner === 0) {
      
        firestore.updateOrderMessageMarkAsOwnerReadAll(selectedChatOrderId, true);
      
    }
    else {
      
        firestore.updateOrderMessageMarkAsOwnerReadAll(selectedChatOrderId, false);
      
    }

    if (unreadAdmin === 0) {

        firestore.updateOrderMessageMarkAsAdminReadAll(selectedChatOrderId, true);
      
    }
    else {
     
        firestore.updateOrderMessageMarkAsAdminReadAll(selectedChatOrderId, false);
      
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log('triggered');
    markMessagesAsRead();
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

                if (m.userId === userdata.uid) {
                  return (
                    <DisplayMessagesRight
                      message={message}
                      dateTime={dateTime}
                      read={read}          
                      image={image}
                    />
                  );
                } else {
                  return (
                    <DisplayMessagesLeft
                      leftNameIfMemberIsOnRight={leftNameIfMemberIsOnRight}
                      chatData={chatData}
                      setChatData={setChatData}
                      message={message}
                      dateTime={dateTime}
                      read={read}
                      userRole={userRole}
                      image={image}
                      recipientId={m.userId}
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
