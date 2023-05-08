import React,{useState, useEffect, useRef} from 'react'

const InputFieldBox = ({callback, sent}) => {

  const [message, setMessage] = useState("")
  const [send, setSend] = useState(null)

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      setSend(true)
    }
    setTimeout(() => {
      setSend(false);
    }, 500);
  }
  // console.log(sent)

  callback(message, send)

  useEffect(()=>{

    if(sent === true){
      setMessage("")
    }

  },[sent])

  return (
    <div className='flex items-center w-10/12 h-full rounded-xl'> 
        <input 
          className='w-full max-h-full ml-1 text-black bg-green-50 border rounded-full outline-none h-5/6
                   placeholder:text-slate-400 indent-4 md:indent-8 hover:border-green2 focus:border-color60' 
          placeholder='Message' 
          value={message}
          type='text'
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          >
        </input>
    </div>
  )
}

export default InputFieldBox