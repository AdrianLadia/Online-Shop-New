import React, {useState, useEffect} from 'react'
import LogoutButton from './LogoutButton'
import RingLoader from "react-spinners/RingLoader";

export const LogOutBox = () => {

  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    setLoading(true)
    setTimeout(()=>{
      setLoading(false)
    }, 1500)
  }, [])

  return (
    <div className='flex flex-row justify-center h-screen w-screen bg-green-100 '>

      {loading === true ? <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><RingLoader color={"#36d7b7"} loading={loading} size={290}/> </div>:

        <div className='flex flex-row justify-center h-screen w-screen bg-pink-100 '>

            <div className='flex flex-col-reverse justify-center '>

                <div className='flex justify-center'>        
                        <LogoutButton />
                </div>

                <div className='flex mb-10 text-4xl font-bold Family Helvetica, Arial, sans-serif'>Access Denied

                </div>

            </div>

        </div>
      }
    </div>
  )
}
