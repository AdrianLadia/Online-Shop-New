import React, {useEffect, useState} from 'react'
import { IoMdSend } from "react-icons/io";

const InputSendButton = ({callback}) => {

  const [clicked, setClicked] = useState(null);

  useEffect(()=>{
    setTimeout(() => {
      setClicked(false);
    }, 5);
  },[clicked])

  callback(clicked)

  return (
    <div className='flex items-center justify-center w-2/12 h-full rounded-full '>
        <button 
            className='flex items-center justify-center w-12/12 p-1 text-white rounded-full md:w-10/12 h-5/6 bg-gradient-to-r hover:bg-gradient-to-t from-blue1 to-color10b'
            onClick={() => setClicked(true)}
              >
              <IoMdSend className='ml-1 text-4xl'/>
        </button>
    </div>
  )
}

export default InputSendButton