import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from '@material-ui/core';
import ChatApp from './ChatApp/src/ChatApp';
import AppContext from '../AppContext';
import { HiOutlineChatAlt, HiChatAlt } from "react-icons/hi";
import { doc, onSnapshot,collection } from 'firebase/firestore';
import { set } from 'date-fns';
import AdminChatMenuOpenButton from './AdminChatMenuOpenButton';

const AdminChatMenu = () => {
    const dummy = useRef(null);
    const [openChat, setOpenChat] = useState(false);
    const {firestore,width,selectedChatOrderId, setSelectedChatOrderId, chatSwitch, setChatSwitch, isadmin,db} = useContext(AppContext);
    const [chatData, setChatData] = useState([])
    const [chatButtonState, setChatButtonState] = useState(null)
    const [chatButtonStateTrigger, setChatButtonStateTrigger] = useState(false)

    useEffect(() => {
      const docRef = collection(db, 'ordersMessages')
      onSnapshot(docRef, (querySnapshot) => {
        
        const chats = []
        querySnapshot.forEach((doc) => {
          if (doc.exists()) {
            const data = doc.data(); 
            const referenceNumber = data.referenceNumber
            const customerName = data.ownerName
            const messages = data.messages
            let unreadCount = 0
            let latestMessage
            if (messages.length === 0) {
                return null
            }
            latestMessage = messages[messages.length - 1].message
            messages.forEach((message) => {
              const userRole = message.userRole
              if (userRole === "member") {
                if (message.read === false) {
                    unreadCount += 1
                }
              }
            })
            if (unreadCount >= 1) {
              chats.push({id:referenceNumber,customerName:customerName,latestMessage:latestMessage,unreadCount:unreadCount})
            }
          } else {
            console.log('No such document!');
          }
        })
        setChatData(chats)
      })
    }, []);

    useEffect(()=>{
      const chatButtonState = {}
      chatData.map((chat)=>{
        {chatButtonState[chat.id] = false}
      })
      setChatButtonState(chatButtonState)
    },[chatData])

  useEffect(()=>{
    if(chatSwitch === false){
      setOpenChat(false)
    }
      dummy.current.scrollIntoView({ behavior: 'smooth' });
  },[chatSwitch])

  return (
    <div className="flex justify-center flex-col lg:flex-row overflow-x-auto h-full">
      <div ref={dummy}/>
      {selectedChatOrderId != null ? <ChatApp setChatData={setChatData} chatData={chatData} chatButtonState={chatButtonState} setChatButtonState={setChatButtonState} chatButtonStateTrigger={chatButtonStateTrigger} setChatButtonStateTrigger={setChatButtonStateTrigger} /> : null}
      <TableContainer 
          className="flex justify-center items-start w-full lg:w-10/12 h-screen bg-gradient-to-r from-colorbackground via-color2 to-color1 " 
          component={Paper}>
        <Table aria-label="chat table" className='w-full overflow-auto ' >
          <TableHead>
            <TableRow className=' bg-gradient-to-br from-green4 to-green1 h-24 '>
              <TableCell > <p className=' flex justify-center text-2xl xl:mr-5 '><HiChatAlt/></p> </TableCell>
              <TableCell className='font-bold'>Customer</TableCell>
              <TableCell className='font-bold'>Reference #</TableCell>
              <TableCell className='font-bold'>Unread Messages</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chatData.map((chat) => (
              <AdminChatMenuOpenButton chat={chat} chatButtonState={chatButtonState} setChatButtonState={setChatButtonState} chatButtonStateTrigger={chatButtonStateTrigger} setChatButtonStateTrigger={setChatButtonStateTrigger} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminChatMenu;
