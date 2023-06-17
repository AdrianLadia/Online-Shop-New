import React, { useEffect } from 'react';
import { Button, TableCell, TableRow, Typography } from '@material-ui/core';
import AppContext from '../AppContext';
import { useContext,useState } from 'react';
import { set } from 'date-fns';
import { object } from 'joi';

const AdminChatMenuOpenButton = (props) => {
  const chat = props.chat;
  const chatButtonState = props.chatButtonState;
  const setChatButtonState = props.setChatButtonState;
  const chatButtonStateTrigger = props.chatButtonStateTrigger;
  const setChatButtonStateTrigger = props.setChatButtonStateTrigger;
  const [openButton, setOpenButton] = useState(false);
  const { setSelectedChatOrderId } = useContext(AppContext);

  function handleOpenButton(chatId) {
    Object.keys(chatButtonState).forEach((key) => {
        if (chatId !== key) {
            chatButtonState[key] = false;
        }
        else {
            chatButtonState[key] = true;
        }
    });
    setChatButtonState(chatButtonState);
    setChatButtonStateTrigger(!chatButtonStateTrigger);
  }

  function handleCloseButton(chatId) {
    chatButtonState[chatId] = false;
    setChatButtonState(chatButtonState);
    setChatButtonStateTrigger(!chatButtonStateTrigger);
    }

    useEffect(() => {
        console.log(chatButtonState);
        if (chatButtonState[chat.id] === true) {
            setOpenButton(true);
            setSelectedChatOrderId(chat.id);
        }
        else {
            setOpenButton(false);
        }
    }, [chatButtonStateTrigger]);

  return (
    <TableRow key={chat.id}>
      <TableCell component="th">
        {/* {openButton ? (
          <Button
            onClick={() => handleCloseButton(chat.id)}
            className=" rounded-full bg-red1 hover:bg-red-400 text-white"
          >
            X
          </Button>
        ) : ( */}
          <Button onClick={() => handleOpenButton(chat.id)} className=" bg-color60 hover:bg-color10c text-white ">
            Open
          </Button>
        {/* )} */}
      </TableCell>
      <TableCell scope="row">
        <Typography className="font-semibold text-slate-500">{chat.customerName}</Typography>
      </TableCell>
      <TableCell>{chat.id}</TableCell>
      <TableCell>
        {chat.unreadCount ? <p className="text-red-500 font-bold">{chat.unreadCount}</p> : <>{chat.unreadCount}</>}
      </TableCell>
    </TableRow>
  );
};

export default AdminChatMenuOpenButton;
