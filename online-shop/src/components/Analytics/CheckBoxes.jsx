import React, { useState, useEffect,useContext } from "react";
import AppContext from "../../AppContext";
import {FaList} from 'react-icons/fa' 
import useWindowDimensions from "./utils/UseWindowDimensions";

export const CheckBoxes = ({name, callback}) => {
  
  const [selectedOption, setSelectedOption] = useState("");
  const [customized, setCustomized] = useState("");
  const [loading, setLoading] = useState(false);
  const {categories}= useContext(AppContext)
  const [showDiv, setShowDiv] = useState(false);
  const { width } = useWindowDimensions();
  const [gridDiv, setgridDiv] = useState(null)

  const toggleDiv = () => {
    setShowDiv(!showDiv);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(()=>{
    setCustomized("");
    setSelectedOption("");
  },[name])

  useEffect(()=>{
    if (width < 90) {
      return setgridDiv(true);
     }else {
      return setgridDiv(false);
     }
  },[width])

  const handleCheckboxChange = (event) => {
    const selectedOption = event.target.name;
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedOption(selectedOption);
    } else {
      setSelectedOption("");
    }
  };

  const handleCustomized = (even) => {
    const customized = even.target.name;
    const isChecked = even.target.checked;
    if (isChecked) {
      setCustomized(customized);
    } else {
      setCustomized("");
    }
  }

  const handleClear= () =>{
    setCustomized("");
    setSelectedOption("");
  }

  callback(selectedOption, customized)
  
  return (
    
    <div className="w-1/2 align-center justify-center ">

      <button onClick={toggleDiv} className=" lg:text-4xl md:text-2xl mt-2 mb-3 ml-2 text-green-700 hover:text-emerald-500"><FaList/></button>
  
    {showDiv && <div className="absolute w-2/12 h-1/2 grid justify-center border-2 border-indigo-800 bg-gradient-to-b from-violet-100 to-indigo-100 rounded-lg overflow-auto">
     
      <div className="grid w-full gap-1 justify-items-center p-1">
      
          {categories && categories.map((type)=>{
              if(type){
                return(
                  <div className="ease-in duration-100 rounded-lg flex flex-col-reverse justify-center gap-1 w-full border-2 border-indigo-300 bg-slate-50 hover:bg-purple-100">
                    <input className="accent-indigo-500 flex place-self-center cursor-pointer w-full"
                        type="checkbox"
                        name= {type}
                        checked={selectedOption.includes(type)}
                        onChange={handleCheckboxChange}
                    />
                      <label className="text-base text-center flex place-self-center text-green-700 font-semibold" htmlFor={type}> {type} </label>
                  </div>    
                    )
                }
            })}     
          
                <div className="rounded-lg col-span-2 ease-in duration-100 grid gap-1 justify-items-center mt-1 mb-2 border-2 border-indigo-300 w-full bg-slate-50 hover:bg-indigo-100 ">
                    <input 
                        type="checkbox"
                        name="true"
                        checked={customized === "true"}
                        onChange={handleCustomized}
                        className="cursor-pointer accent-pink-500"
                    />
                    <label className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-yellow-500 to-red-500" htmlFor="isCustomized"> Customized</label>
                </div>

                <div className="col-span-2 grid gap-1 justify-items-center mt-2 ">
                  {customized === ""  && selectedOption === "" ?  null  : 
                    <div className="flex"> 
                        <button className="p-1  bg-red-400 border-2 text-xs border-red-600 rounded-lg hover:bg-red-300 " 
                        onClick={handleClear}>Clear All</button>    
                    </div>
                  }  
                
                </div>
        </div>   
           
              </div>}
    </div>
);
}