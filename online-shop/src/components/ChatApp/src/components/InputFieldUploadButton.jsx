import React, {useState, useEffect} from 'react'
import { BsFileEarmarkImage } from "react-icons/bs";

const InputFieldUploadButton = ({callback}) => {
    
    const [file, setFile] = useState(null);

    function upload(event){
        setFile(URL.createObjectURL(event.target.files[0]))
    }

    useEffect(()=>{
      callback(file)
    },[file])

  return (
    <div className='flex w-1/12 h-5/6 '>
        <button
            type='file'
            className='bg-indigo-400 w-full h-full rounded-xl overflow-auto flex items-center justify-center text-white'
                >
                <input type='file' id="s" style={{ display: 'none' }} className='text-center ' onChange={(event) => {upload(event)}}/>
                <label htmlFor="s"><BsFileEarmarkImage /></label>
        </button>

    </div>
  )
}

export default InputFieldUploadButton