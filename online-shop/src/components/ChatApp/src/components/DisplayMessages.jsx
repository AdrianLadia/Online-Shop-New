import React, { useState, useEffect, useContext, useRef } from 'react';
import DisplayMessagesUser from './DisplayMessagesUser';
import DisplayMessagesAdmin from './DisplayMessagesAdmin';
import AppContext from '../../../../AppContext';

const DisplayMessages = (props) => {
  const { chatSwitch } = useContext(AppContext);
  const messages = props.messages.messages;
  const userName = props.userName;
  const loggedInUserId = props.loggedInUserId;
  const user = props.user;
  const chatData = props.chatData;
  const setChatData = props.setChatData;

  const messagesRef = useRef(null);

  const scrollToBottom = () => {
    const messagesContainer = messagesRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-full bg-green4 border-color60 rounded-xl border-x-4 h-5/6">
      <div className="h-full ">
        <div ref={messagesRef} className="flex flex-col w-full h-full overflow-auto scrollbar-thumb-gray-500 scrollbar-track-gray-200 scrollbar-thin">
          {messages
            ? messages.map((m, index) => {
                const message = m.message;
                const dateTime = m.dateTime;
                const userRole = m.userRole;
                const read = m.read;
                const image = m.image;
                if (m.userId === loggedInUserId) {
                  return (
                    <DisplayMessagesUser
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
                    <DisplayMessagesAdmin
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
