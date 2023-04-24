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
    <div className='flex flex-col items-center w-full mb-2'>
        <div className='flex flex-row'>
                <input type="text" placeholder='Enter item name... ' value={selectedOption} onChange={handleBoth} 
                        className=' 2xs:h-12 outline-none w-full mb-2 rounded-lg p-1 -mr-8
                                    border-2 border-emerald-600 bg-emerald-200 focus:bg-emerald-100
                                    border-r-2 '/>

                <button className="px-1 mb-2 2xs:h-12 text:sm 2xs:text-lg text-red-500 hover:text-red-300 
                                   border-emerald-600 border-l-2 border-r-0 rounded-md " 

                        onClick={handleClear}><FaEraser/></button>    
        </div>
        {inputText.length != 0 && (
          <div className='h-36 overflow-auto rounded-lg w-full flex flex-col items-center'>
             
             {inputText.slice(0,10).map((data)=>{
                return(
                    <div className='flex items-center justify-center w-full text-xs'>
                        <button className='p-2 border-2 w-11/12 2xs:w-9/12 mb-1 rounded-lg border-emerald-200 bg-emerald-50 h-10 hover:bg-emerald-100 cursor-pointer '
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
