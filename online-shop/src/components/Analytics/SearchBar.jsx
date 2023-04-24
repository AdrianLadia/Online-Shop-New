import React, {useState, useEffect} from 'react'
import {FaEraser} from 'react-icons/fa' 

export const SearchBar = ({name, products, callback}) => {

    const [selectedOption, setSelectedOption] = useState("");
    const [inputText, setInputText] = useState([]);
    
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
    <div className='grid grid-col justify-center ml-2'>
        <div className='flex flex-row justify-center'>

                <input type="text" placeholder='Enter item name...' value={selectedOption} onChange={handleBoth} 
                className='text-center overflow-auto w-5/6 outline-none border-2 h-12 border-emerald-600 bg-emerald-200 p-1 mb-2 focus:bg-emerald-100 rounded-xl'/>

                <button className="p-1 mb-2 text-2xl text-red-500 hover:text-red-300 rounded-lg ease-in delay-100" onClick={handleClear}><FaEraser/></button>    
        </div>

        {inputText.length != 0 && (
            
        <div className=' h-60 w-full overflow-auto rounded-lg items-center content-center'>
            
             {inputText.slice(0,10).map((data)=>{
                return(
                    <div className='items-center content-center '>
                        <button className='p-1 ml- w-10/12 border-2 rounded-lg border-emerald-200 bg-emerald-50 h-22 hover:bg-emerald-100 cursor-pointer overflow-auto'
                                            onClick={() => setSelectedOption(data)}
                                            > {data} </button> 
                    </div>
                )
             })}
        </div>
        )}
    </div>
  )
}
