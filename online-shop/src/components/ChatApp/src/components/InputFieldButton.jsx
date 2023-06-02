import React, {useEffect, useState} from 'react'
import { IoMdSend } from "react-icons/io";

const InputSendButton = (props) => {

  const sendMessage = props.sendMessage
  const setMessage = props.setMessage

  function onSendButtonClick() {
    sendMessage()
    setMessage('')
  }

  return (
    <div className='flex items-center justify-center w-3/12 mr-1 h-full rounded-full '>
        <button 
            className='flex items-center justify-center w-full p-1 text-white rounded-full md:w-11/12 h-5/6 bg-gradient-to-r hover:bg-gradient-to-t from-blue1 to-color10b'
            onClick={onSendButtonClick}
              >
              <IoMdSend className='ml-1 text-4xl'/>
        </button>
    </div>
  )
}

export default InputSendButton