import React, { useEffect, useRef, useState, useContext } from 'react';
import { TiArrowForward } from 'react-icons/ti';
import { doc, getDoc } from 'firebase/firestore';
import db from '../firebase';
import AppContext from '../../../../AppContext';
import { BiCircle, BiCheckCircle, BiXCircle } from 'react-icons/bi';
import dataManipulation from '../../../../../utils/dataManipulation';
import Image from '../../../ImageComponents/Image';

const DisplayMessagesAdmin = (props) => {
  const { selectedChatOrderId, firestore, isadmin, chatSwitch } = useContext(AppContext);
  const message = props.message;
  const dateTime = props.dateTime;
  const datamanipulation = new dataManipulation();
  const convertedDate = datamanipulation.convertDateTimeStampToDateString(dateTime);
  const userName = props.userName;
  const loggedInUserId = props.loggedInUserId;
  const userRole = props.userRole;
  const read = props.read;
  const user = props.user;
  const image = props.image;
  const chatData = props.chatData;
  const setChatData = props.setChatData;

  console.log(chatData)


  const dummy = useRef(null);
  const [showDetails, setShowDetails] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (isadmin === false) {
      dummy.current.scrollIntoView({ behavior: 'smooth' });
      setName('Admin');
    } else {
      setName(userName);
    }
  }, []);
  
  async function updateMessages() {
    console.log('clicked')
    console.log(dateTime)
    const docRef = doc(db, 'ordersMessages', selectedChatOrderId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const messages = data.messages;
    
    let unreadOwner = 0;
    let unreadAdmin = 0;
    
    messages.map((mess) => {
      if (mess.userRole === 'member' && loggedInUserId !== mess.userId) {
        console.log(mess.dateTime)
        console.log(dateTime)
        if (datamanipulation.convertDateTimeStampToDateString(mess.dateTime) == datamanipulation.convertDateTimeStampToDateString(dateTime)) {
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
    
    if (data.adminReadAll === true) {
      const newChatData = chatData.filter((chat) => chat.id != selectedChatOrderId)
      setChatData(newChatData)
    }

    console.log(messages)
    firestore.updateOrderMessageAsRead(selectedChatOrderId, messages);
    firestore.updateOrderMessageMarkAsOwnerReadAll(selectedChatOrderId, data.ownerReadAll);
    firestore.updateOrderMessageMarkAsAdminReadAll(selectedChatOrderId, data.adminReadAll);
  }

  function handleMessageClick() {
    console.log('clicked')
    setShowDetails(!showDetails);
    updateMessages();
  }

  function adminColor() {
    if (userRole === 'member' && read === false) {
      return ' bg-gradient-to-tr from-red-300 to-red-400';
    } else {
      return ' bg-gradient-to-tr from-green1 to-green2';
    }
  }

  function adminTextColor() {
    if (userRole === 'member' && read === false) {
      return ' text-red-300';
    }
  }

  return (
    <div className="flex items-start h-max ml-0.5">
      
      <div className="flex items-center justify-center w-2/12 h-full rounded-full lg:w-1/12 mt-3">
        <div className="w-16 h-16 bg-gradient-to-tl from-green2 to-green1 border-4 border-green1 rounded-full sm:h-20 sm:w-20 ">
          <div className="flex items-center justify-center h-full text-2xl font-bold text-white uppercase">
            {name[0]}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start justify-center w-11/12 max-h-full lg:w-3/5">
        <>
          <div
            className={
              'flex justify-center max-w-full max-h-full mt-3 text-green3 md:ml-2 hyphens-auto' + adminTextColor()
            }
          >
            {showDetails ? (
              <>
                <p>
                  <TiArrowForward className="mt-1" />
                </p>
                <p>Sent at {convertedDate},</p>
                {read ? <p> Seen</p> : null}
              </>
            ) : (
              <p className="ml-2 ">{name}</p>
            )}
          </div>
          <div className="flex flex-row items-end">
            <div
              className={
                'max-w-full max-h-full p-3 px-4 m-2 my-2 mr-4 text-white md:p-4 md:px-6 rounded-3xl cursor-help' +
                adminColor()
              }
              onClick={handleMessageClick}
            >
              <p>
                <p>{message}</p>
                {/* {image ? <img src={image} alt='this should be an image' className='h-64 w-64'/> : null} */}
                {image ? <Image imageUrl={image} /> : null}
              </p>
            </div>
            <div className={'mb-2 -ml-5 text-green3 ' + adminTextColor()}>
              {read ? <BiCheckCircle /> : <BiXCircle />}
            </div>
          </div>

          <div ref={dummy}></div>
        </>
      </div>
    </div>
  );
};

export default DisplayMessagesAdmin;
