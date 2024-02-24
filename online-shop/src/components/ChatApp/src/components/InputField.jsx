import React, { useContext, useEffect, useState, useRef } from 'react';
import InputBox from './InputFieldBox';
import InputSendButton from './InputFieldButton';
import { doc, updateDoc, arrayUnion, Timestamp, getDoc, getDocs } from 'firebase/firestore';
import AppContext from '../../../../AppContext';
import db from '../firebase';
// import InputFieldUploadButton from './InputFieldUploadButton';
import ImageUploadButton from '../../../ImageComponents/ImageUploadButton';
import { Typography } from '@mui/material';

const InputField = (props) => {
  const loggedInUserId = props.stloggedInUserId;
  const orderClosed = props.orderClosed;
  const [message, setMessage] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [imageLink, setImageLink] = useState(null);
  const [send, setSend] = useState(false);
  const { userId, selectedChatOrderId, userdata, firestore, storage } = useContext(AppContext);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const dummy = useRef(null);

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  });

  async function updateMessages() {
    const docRef = doc(db, 'ordersMessages', selectedChatOrderId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const messages = data.messages;

    let unreadAdmin = 0;
    let unreadOwner = 0;
    messages.map((mess) => {
      if (mess.userRole !== 'member' && loggedInUserId !== mess.userId) {
        mess.read = true;
      }

      if (mess.read === false && mess.userRole != 'member') {
        unreadAdmin += 1;
      }
      if (mess.read === false && mess.userRole === 'member') {
        unreadOwner += 1;
      }
    });

    if (unreadAdmin === 0) {
      data.adminReadAll = true;
    } else {
      data.adminReadAll = false;
    }

    if (unreadOwner === 0) {
      data.ownerReadAll = true;
    } else {
      data.ownerReadAll = false;
    }
    firestore.updateOrderMessageMarkAsOwnerReadAll(selectedChatOrderId, data.ownerReadAll);
    firestore.updateOrderMessageMarkAsAdminReadAll(selectedChatOrderId, data.adminReadAll);
    firestore.updateOrderMessageAsRead(selectedChatOrderId, messages);
  }

  async function sendImage(url) {
    const docRef = doc(db, 'ordersMessages', selectedChatOrderId);
    // Add data to the array field
    updateDoc(docRef, {
      messages: arrayUnion({
        // add a new map object to the array field
        message: '',
        userId: userId,
        dateTime: new Date(),
        userRole: userdata.userRole,
        read: false,
        image: url,
      }),
    })
      .then(() => {
        setMessage('');
        setNewMessage('');
      })
      .catch((error) => {
        setMessage('');
        setNewMessage('');
      });
  }

  async function sendMessage() {

    const docRef = doc(db, 'ordersMessages', selectedChatOrderId);
    // Add data to the array field
    updateDoc(docRef, {
      messages: arrayUnion({
        // add a new map object to the array field
        message: message,
        userId: userId,
        dateTime: new Date(),
        userRole: userdata.userRole,
        read: false,
        image: '',
      }),
    })
      .then(() => {
        setMessage('');
        setNewMessage('');
      })
      .catch((error) => {
        setMessage('');
        setNewMessage('');
      });
  }

  function inputMessage(option1, option2) {
    setMessage(option1);
    setSend(option2);
    if (option2 === true) {
      setNewMessage(message);
      sendMessage();
    }
  }

  function getUploadedImageUrl(url) {
    setUploadedImageUrl(url);
    sendImage(url);
  }

  return (
    <div className="flex flex-col justify-end w-full h-1/10 ml-0.5 md:ml-2">
      <div className="w-full h-full">
        <div ref={dummy} className="flex items-center gap-1 w-full h-full rounded-lg">
          {orderClosed ? (
            <div className='flex justify-center w-full'>
              <Typography variant='body1' color='white'>
                This order is closed. You cannot send any message. Please use Customer Service menu instead to message us.
              </Typography>
            </div>
          ) : (
            <>
              <ImageUploadButton
                id={'userUploadPhotoButton'}
                folderName={'Orders/' + userId + '/' + selectedChatOrderId}
                buttonTitle={''}
                storage={storage}
                onUploadFunction={getUploadedImageUrl}
              />
              <InputBox
                sendMessage={sendMessage}
                message={message}
                setMessage={setMessage}
                sent={send}
                image={imageLink}
              />
              <InputSendButton sendMessage={sendMessage} setMessage={setMessage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputField;
