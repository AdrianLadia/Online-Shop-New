import React, {useEffect, useState} from 'react'
import { BiSend } from "react-icons/bi";
import { TiMediaEjectOutline } from "react-icons/ti";
import { RiSendPlaneFill } from "react-icons/ri";
import { GrSend } from "react-icons/gr";
import { IoMdSend } from "react-icons/io";

const InputSendButton = ({callback}) => {

  const [clicked, setClicked] = useState(null);
  
  // console.log(clicked)

  useEffect(()=>{
    setTimeout(() => {
      setClicked(false);
    }, 5);
  },[clicked])

  callback(clicked)

  return (
    <div className='flex items-center justify-center w-2/12 h-full rounded-full -my-11'>
        <button 
            className='flex items-center justify-center w-11/12 p-1 text-white bg-indigo-500 rounded-full md:w-10/12 h-5/6 hover:bg-indigo-400'
            onClick={() => setClicked(true)}
              >
              <IoMdSend className='ml-1 text-4xl'/>
        </button>
    </div>
  )
}

export default InputSendButton