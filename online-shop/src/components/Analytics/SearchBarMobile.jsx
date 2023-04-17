import React, {useState, useEffect} from 'react'
import {FaEraser} from 'react-icons/fa' 

export const SearchBarMobile = ({name, products, callback}) => {

    const [selectedOption, setSelectedOption] = useState("");
    const [inputText, setInputText] = useState([]);

    // useEffect(()=>{
    //   setSelectedOption("");
    // },[name])

    const handleSelectedOption = (event) => {
        const input = event.target.value;
        setSelectedOption(input)
      };
  
    callback(selectedOption)

    const handleInputText = (event) => {
        const input = event.target.value;
        const suggestions = products.filter((s)=>{
            return s.toLowerCase().includes(input.toLowerCase())
        });

        if(input === ""){
            setInputText([]);
        }else{
            setInputText(suggestions);
        }
      };

      const handleBoth = (event) => {
        handleSelectedOption(event);
        handleInputText(event);
      };  

      const handleClear= () => {
        setSelectedOption("");
        setInputText("");
      }
      
  return (
    <div className='flex flex-col items-center justify-center  mb-2'>
        <div className='flex flex-row'>
                <input type="text" placeholder='Enter item name... ' value={selectedOption} onChange={handleBoth} 
                className='ml-1 outline-none border-2 border-emerald-600 bg-emerald-200 p-1 mb-1 focus:bg-emerald-100 rounded-lg'/>
                <button className="p-1 mb-2 text-lg text-red-500 hover:text-red-300 rounded-lg ease-in delay-100" onClick={handleClear}><FaEraser/></button>    
        </div>
        {inputText.length != 0 && (
          <div className='h-20  overflow-auto rounded-lg items-center content-center'>
            
            
             {inputText.slice(0,10).map((data)=>{
                return(
                    <a className=' items-center content-center w-full'>
                        <button className='p-2 w-full border-2 rounded-lg border-emerald-200 bg-emerald-50 h-10 hover:bg-emerald-100 cursor-pointer '
                                            onClick={() => setSelectedOption(data)}
                                            > {data} </button> 
                    </a>
                )
             })}
        </div>
        )} 
    </div>
  )
}
