import React, { useContext, useEffect, useState } from 'react';
import InputBox from './InputFieldBox';
import InputSendButton from './InputFieldButton';
import { doc, updateDoc, arrayUnion, Timestamp, getDoc, getDocs } from 'firebase/firestore';
import AppContext from '../../../../AppContext';
import db from '../firebase';
// import InputFieldUploadButton from './InputFieldUploadButton';
import ImageUploadButton from '../../../ImageComponents/ImageUploadButton';

const InputField = (props) => {
  const orderReferenceId = props.orderReferenceId;
  const loggedInUserId = props.loggedInUserId;
  const [message, setMessage] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [imageLink, setImageLink] = useState(null);
  const [newImageLink, setNewImageLink] = useState(null);
  const [send, setSend] = useState(false);
  const date = new Date();
  const { userId, selectedChatOrderId, userdata, firestore, storage } = useContext(AppContext);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  console.log(message);
  console.log(send);

  async function updateMessages() {
    const docRef = doc(db, 'ordersMessages', orderReferenceId);
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
    firestore.updateOrderMessageMarkAsOwnerReadAll(orderReferenceId, data.ownerReadAll);
    firestore.updateOrderMessageMarkAsAdminReadAll(orderReferenceId, data.adminReadAll);
    firestore.updateOrderMessageAsRead(orderReferenceId, messages);
  }

  async function sendImage(url) {
    console.log(orderReferenceId);
    const docRef = doc(db, 'ordersMessages', orderReferenceId);
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
        console.log('Message is sent Successfuly: ', newMessage);
        setMessage('');
        setNewMessage('');
      })
      .catch((error) => {
        console.error('Error adding data to the array field: ', error);
        setMessage('');
        setNewMessage('');
      });
  }

  async function sendMessage() {
    console.log(orderReferenceId);
    const docRef = doc(db, 'ordersMessages', orderReferenceId);
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
        console.log('Message is sent Successfuly: ', newMessage);
        setMessage('');
        setNewMessage('');
      })
      .catch((error) => {
        console.error('Error adding data to the array field: ', error);
        setMessage('');
        setNewMessage('');
      });


  }

  function inputMessage(option1, option2) {
    console.log('a');
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
        <div className="flex items-center gap-1 w-full h-full rounded-lg">
          <ImageUploadButton
            id={'userUploadPhotoButton'}
            folderName={'Orders/' + userId + '/' + orderReferenceId}
            buttonTitle={''}
            storage={storage}
            onUploadFunction={getUploadedImageUrl}
          />
          <InputBox sendMessage={sendMessage} message={message} setMessage={setMessage} sent={send} image={imageLink} />
          <InputSendButton sendMessage={sendMessage} setMessage={setMessage} />
        </div>
      </div>
    </div>
  );
};

export default InputField;
