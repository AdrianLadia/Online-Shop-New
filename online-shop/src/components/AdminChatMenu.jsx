import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Button,
} from '@material-ui/core';
import ChatApp from './ChatApp/src/ChatApp';
import AppContext from '../AppContext';
import { HiOutlineChatAlt, HiChatAlt } from "react-icons/hi";
import { doc, onSnapshot,collection } from 'firebase/firestore';
import { set } from 'date-fns';

const AdminChatMenu = () => {
    const dummy = useRef(null);
    const [openChat, setOpenChat] = useState(false);
    const {firestore,width,selectedChatOrderId, setSelectedChatOrderId, chatSwitch, setChatSwitch, isadmin,db} = useContext(AppContext);
    const [chatData, setChatData] = useState([])

    useEffect(() => {
      const docRef = collection(db, 'ordersMessages')
      console.log('ran this effect')
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
  
  // function convertChatMessageToFitTable(message) {
  //   let messageLength;
  //   if (width <= 390) {
  //     messageLength = 20;
  //   } else if (width <= 640) {
  //     messageLength = 30;
  //   } else if (width <= 768) {
  //     messageLength = 40;
  //   } else if (width <= 1024) {
  //     messageLength = 50;
  //   } else {
  //     messageLength = 100;
  //   }

  //   if (message.length > messageLength) {
  //     return message.substring(0, messageLength) + '...';
  //   }
  //   return message;
  // }

  function handleBoth(ref, toggle){
    setChatSwitch(toggle)
    setOpenChat(toggle)
    setSelectedChatOrderId(ref)
  }

  useEffect(()=>{
    if(chatSwitch === false){
      setOpenChat(false)
    }
      dummy.current.scrollIntoView({ behavior: 'smooth' });
  },[chatSwitch])

  return (
    <div className="flex justify-center flex-col lg:flex-row overflow-x-auto">
      <div ref={dummy}/>
      {openChat ? <ChatApp setChatData={setChatData} chatData={chatData} /> : null}
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
              <TableRow key={chat.id} >
                <TableCell component="th">
                  {selectedChatOrderId === chat.id && openChat ? 
                    <Button 
                      onClick={() => handleBoth(chat.id, false)} 
                      className=" rounded-full bg-red1 hover:bg-red-400 text-white"
                      >X
                    </Button>
                  :
                    <Button 
                      onClick={() => handleBoth(chat.id, true)} 
                      className=" bg-color60 hover:bg-color10c text-white "
                      >Open
                    </Button>
                  }
                </TableCell>
                <TableCell  scope="row">
                  <Typography className="font-semibold text-slate-500">{chat.customerName}</Typography>
                </TableCell>
                <TableCell>{chat.id}</TableCell>
                <TableCell>{chat.unreadCount? (<p className='text-red-500 font-bold'>{chat.unreadCount}</p>): (<>{chat.unreadCount}</>) }</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminChatMenu;
