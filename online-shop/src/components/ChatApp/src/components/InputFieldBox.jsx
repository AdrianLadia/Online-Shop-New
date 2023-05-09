import React,{useState, useEffect, useRef} from 'react'

const InputFieldBox = ({callback, sent, image}) => {

  const [message, setMessage] = useState("")
  const [send, setSend] = useState(null)
  const [link, setLink] =useState()

  useEffect(()=>{
    setLink(image)
  },[image])

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      setSend(true)
    }
    setTimeout(() => {
      setSend(false);
    }, 500);
  }

  callback(message, send)

  useEffect(()=>{
    if(sent === true){
      setMessage("")
    }

  },[sent])

  function erase(){
    setLink("")
  }

  return (
    <div className='flex items-center w-9/12 h-full rounded-xl'> 
      {link? <div>
        <img src={link} className='h-14 w-14'></img>
        <button onClick={erase} className='font-bold mb-0'>X</button>
      </div>:null}
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