import React, { useContext, useEffect, useRef, useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@material-ui/core';
import ChatApp from './ChatApp/src/ChatApp';
import AppContext from '../AppContext';
import { HiOutlineChatAlt, HiChatAlt } from 'react-icons/hi';
import { doc, onSnapshot, collection,where,query } from 'firebase/firestore';
import { set } from 'date-fns';
import AdminChatMenuOpenButton from './AdminChatMenuOpenButton';
import firestoredb from '../firestoredb';
import menuRules from '../../utils/classes/menuRules';
import NotificationSound from '../sounds/chat.mp3';

const AdminChatMenu = () => {
  const dummy = useRef(null);
  const [openChat, setOpenChat] = useState(false);
  const { firestore, selectedChatOrderId, chatSwitch, isadmin, db, userdata } = useContext(AppContext);
  const [chatData, setChatData] = useState([]);
  const [chatButtonState, setChatButtonState] = useState(null);
  const [chatButtonStateTrigger, setChatButtonStateTrigger] = useState(false);
  const alreadyTriedToSearchName = [];
  const rules = new menuRules(userdata.userRole);


  const playSound = () => {
    const audioEl = document.getElementsByClassName('audio-element')[0];
    audioEl.play();
  };

  useEffect(() => {
    const docRef = collection(db, 'ordersMessages')
    const q = query(docRef, where('delivered', '==', false));
    const unsubscibe = onSnapshot(q, (querySnapshot) => {
      const chats = [];
      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const referenceNumber = data.referenceNumber;
          const customerName = data.ownerName;
          const messages = data.messages;
          let unreadCount = 0;
          let latestMessage;
          if (messages.length === 0) {
            return null;
          }
          latestMessage = messages[messages.length - 1].message;
          messages.forEach((message) => {
            const userRole = message.userRole;
            if (userRole === 'member') {
              if (message.read === false) {
                unreadCount += 1;
              }
            }
          });
          if (unreadCount >= 1) {
            chats.push({
              id: referenceNumber,
              customerName: customerName,
              latestMessage: latestMessage,
              unreadCount: unreadCount,
            });
            
          }
        } else {
          console.log('No such document!');
        }
      });
      
      if (chats.length > chatData.length) {

        playSound();
      }

      setChatData(chats);
    });



    return () => unsubscibe();
  }, []);

  useEffect(() => {
    const chatButtonState = {};
    chatData.map((chat) => {
      {
        chatButtonState[chat.id] = false;
      }
    });
    setChatButtonState(chatButtonState);
  }, [chatData]);

  useEffect(() => {
    if (chatSwitch === false) {
      setOpenChat(false);
    }
    if (rules.checkIfUserAuthorized('adminChat')) {
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatSwitch]);

  useEffect(() => {
    chatData.map((chat) => {
      if (chat.customerName === null) {
        if (alreadyTriedToSearchName.includes(chat.id)) {
          return null;
        }
        const customerId = chat.id;
        alreadyTriedToSearchName.push(customerId);
        firestore.readUserById(customerId).then((user) => {
          const customerName = user.name;
          firestore.updateOrderMessageName(customerId, customerName);
     
        });
      }
    });
  }, [chatData]);

  return (
    <>
      {rules.checkIfUserAuthorized('adminChat') ? (
        <div className="flex justify-center flex-col lg:flex-row overflow-x-auto h-full">
          <div ref={dummy} />
          {selectedChatOrderId != null ? (
            <ChatApp
              setChatData={setChatData}
              chatData={chatData}
              chatButtonState={chatButtonState}
              setChatButtonState={setChatButtonState}
              chatButtonStateTrigger={chatButtonStateTrigger}
              setChatButtonStateTrigger={setChatButtonStateTrigger}
            />
          ) : null}
          <TableContainer
            className="flex justify-center items-start w-full lg:w-10/12 h-screen bg-gradient-to-r from-colorbackground via-color2 to-color1 "
            component={Paper}
          >
            <Table aria-label="chat table" className="w-full overflow-auto ">
              <TableHead>
                <TableRow className=" bg-gradient-to-br from-green4 to-green1 h-24 ">
                  <TableCell>
                    {' '}
                    <p className=" flex justify-center text-2xl xl:mr-5 ">
                      <HiChatAlt />
                    </p>{' '}
                  </TableCell>
                  <TableCell className="font-bold">Customer</TableCell>
                  <TableCell className="font-bold">Reference #</TableCell>
                  <TableCell className="font-bold">Unread Messages</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {chatData.map((chat) => (
                  <AdminChatMenuOpenButton
                    chat={chat}
                    chatButtonState={chatButtonState}
                    setChatButtonState={setChatButtonState}
                    chatButtonStateTrigger={chatButtonStateTrigger}
                    setChatButtonStateTrigger={setChatButtonStateTrigger}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <>UNAUTHORIZED</>
      )}
      <audio className="audio-element">
        <source src={NotificationSound}></source>
      </audio>
    </>
  );
};

export default AdminChatMenu;
