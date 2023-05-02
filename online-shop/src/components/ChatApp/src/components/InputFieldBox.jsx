import React,{useState, useEffect} from 'react'

const InputFieldBox = ({callback}, sent) => {

  const [message, setMessage] = useState("")

  // console.log(sent)

  useEffect(()=>{
    if(sent){
      setMessage("")
    }
  },[])
  
  callback(message)

  return (
    <div className='flex items-center w-10/12 h-full rounded-xl'> 
        <input 
          className='w-full max-h-full ml-1 text-black bg-indigo-100 border rounded-full outline-none h-5/6 placeholder:text-slate-400 indent-4 md:indent-8 hover:border-indigo-400 focus:border-indigo-400' 
          placeholder='Message' 
          value={message}
          type='text'
          onChange={(event) => setMessage(event.target.value)}
          >
        </input>
    </div>
  )
}

export default InputFieldBox