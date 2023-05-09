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

  async function sendMessages() {
    const docRef = doc(db, 'ordersMessages', orderReferenceId);
    // Add data to the array field
    if (newMessage || uploadedImageUrl) {
      console.log('ran');
      const timestamp = Timestamp.fromDate(date);
      const timestampString = timestamp.toDate().toLocaleString();
      updateDoc(docRef, {
        messages: arrayUnion({
          // add a new map object to the array field
          message: newMessage,
          userId: userId,
          dateTime: timestampString,
          userRole: userdata.userRole,
          read: false,
          image: uploadedImageUrl,
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
  }

  function inputMessage(option1, option2) {
    setMessage(option1);
    setSend(option2);
    if (option2 === true) {
      setNewMessage(message);
      sendMessages();
    }
  }

  function sendMessage(option1) {
    setSend(option1);
    if (option1 === true) {
      setNewMessage(message);
      setMessage('');
      sendMessages();
    }
  }

  function getUploadedImageUrl(url) {
    setUploadedImageUrl(url);
    setSend(true);
  }

  useEffect(() => {
    sendMessages()
    setUploadedImageUrl(null)
  }, [uploadedImageUrl]);

  useEffect(() => {
    if (send) {
      setNewMessage(message);
      setImageLink('');
    }
    updateMessages();
  }, [send]);

  return (
    <div className="flex flex-col justify-end w-full h-1/10">
      <div className="w-full h-full">
        <div className="flex items-center gap-1 w-full h-full rounded-lg">
          <ImageUploadButton 
            id={'userUploadPhotoButton'}
            folderName={'Orders/' + userId + '/' + orderReferenceId}
            buttonTitle={""}
            storage={storage}
            onUploadFunction={getUploadedImageUrl}
          />
          <InputBox callback={inputMessage} sent={send} image={imageLink} />
          <InputSendButton callback={sendMessage} />
        </div>
      </div>
    </div>
  );
};

export default InputField;
