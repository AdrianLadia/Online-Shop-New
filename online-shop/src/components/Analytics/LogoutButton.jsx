import React, {useState, useEffect} from 'react'
import { signOut,getAuth } from 'firebase/auth'
import {FaSignOutAlt} from 'react-icons/fa' 
import PulseLoader from "react-spinners/PulseLoader";


const LogoutButton = () => {

  // const [loading, setLoading] = useState(false);
  
  // useEffect(() => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 1900);
  // }, []);

  return (
    <div className='flex'>
       {/* {loading === true ? <div  style={{ display: 'flex', justifyContent: 'left', alignItems: 'left' }}><PulseLoader color={"#36d7b7"} loading={loading} size={12}/> </div>: */}
        <button className='flex self-center items-center w-full p-2 2xl:p-3 lg:uppercase gap-1 border-2 border-red-700  bg-red-400  rounded-3xl transition duration-200
                           hover:bg-red-300 font-semibold hover:border-orange-400' onClick={() => signOut(getAuth())}><FaSignOutAlt/> LOGOUT </button>
      
    </div>
  )
}

export default LogoutButton
