import React, { useContext, useEffect } from 'react';
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
import { useState } from 'react';


const AdminChatMenu = () => {
    const [openChat, setOpenChat] = useState(false);
    const {firestore,width,selectedChatOrderId, setSelectedChatOrderId,chatSwitch,setChatSwitch} = useContext(AppContext);
    const [chatData,setChatData] = useState([])

    useEffect(() => {
        firestore.readAllOrderMessages().then((res) => {
            let chatData = []
            res.forEach((chat) => {
                const referenceNumber = chat.referenceNumber
                const customerName = chat.ownerName
                const messages = chat.messages
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
                chatData.push({id:referenceNumber,customerName:customerName,latestMessage:latestMessage,unreadCount:unreadCount})
            }) 
            console.log(chatData)
            setChatData(chatData)
        })
    }, []);
    
  function convertChatMessageToFitTable(message) {
    let messageLength;
    if (width <= 390) {
      messageLength = 20;
    } else if (width <= 640) {
      messageLength = 30;
    } else if (width <= 768) {
      messageLength = 40;
    } else if (width <= 1024) {
      messageLength = 50;
    } else {
      messageLength = 100;
    }

    if (message.length > messageLength) {
      return message.substring(0, messageLength) + '...';
    }
    return message;
  }

  const handleOpen = (referenceNumber) => {
    console.log(referenceNumber)
    setOpenChat(true);
    setSelectedChatOrderId(referenceNumber)
    setChatSwitch(!chatSwitch)
  };

  return (
    <div className="flex justify-center flex-col lg:flex-row">
      {openChat ? <ChatApp /> : null}
      <TableContainer className="flex justify-center w-12/12 lg:w-10/12 h-screen" component={Paper}>
        <Table aria-label="chat table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Latest Message</TableCell>
              <TableCell>Unread Messages</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chatData.map((chat) => (
              <TableRow key={chat.id}>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleOpen(chat.id)} className="px-4 py-1">
                    Open Chat
                  </Button>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Typography className="font-semibold">{chat.customerName}</Typography>
                </TableCell>
                <TableCell>{convertChatMessageToFitTable(chat.latestMessage)}</TableCell>
                <TableCell>{chat.unreadCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminChatMenu;
