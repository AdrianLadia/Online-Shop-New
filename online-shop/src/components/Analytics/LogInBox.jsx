import React, {useState, useEffect} from 'react'
import LoginButton from './LoginButton'
// import RingLoader from "react-spinners/RingLoader";

export const LogInBox = () => {

  useEffect(()=>{
    setTimeout(()=>{
    }, 1500)
  }, [])

  return (
    <div className='flex flex-row justify-center h-screen w-screen bg-green-100 '>
      {/* {loading === true ? <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><RingLoader color={"#36d7b7"} loading={loading} size={150}/> </div>: */}
        <div className='flex flex-col-reverse justify-center '>
            <div className='flex justify-center'>        
                    <LoginButton />
            </div>
            <div className='flex mb-10 text-3xl font-bold Family Helvetica, Arial, sans-serif'>Log In To View Data </div>
        </div>
      {/* } */}
    </div>
  )
}
