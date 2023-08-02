import React, { useState, useEffect,useContext } from "react";
import AppContext from "../../AppContext";
import {FaList} from 'react-icons/fa' 

export const CheckBoxesMobile = ({name, callback}) => {
  
  const [selectedOption, setSelectedOption] = useState("");
  const [customized, setCustomized] = useState("");
  const [loading, setLoading] = useState(false);
  const {categories}= useContext(AppContext)
  const [showDiv, setShowDiv] = useState(false);

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
    
    <div className="grid grid-cols-2 justify-center gap-2 w-full rounded-lg ">
        {categories && categories.map((type)=>{
            if(type){
              return(
                <div className=" rounded-lg flex flex-col-reverse justify-center gap-1 w-full border-2 border-emerald-200 bg-emerald-100 hover:bg-green-200">
                  <input className="accent-red-500 flex place-self-center cursor-pointer "
                        type="checkbox"
                        name= {type}
                        id={type}
                        checked={selectedOption.includes(type)}
                        onChange={handleCheckboxChange}
                  />
                  <label className="text-xs flex place-self-center text-green-700 font-semibold" htmlFor={type}> {type} </label>
                </div>    
                  )
              }
          })}     
              <div className="rounded-lg col-span-2 grid gap-1 justify-items-center mt-1 border-2 border-emerald-200 w-full bg-emerald-100 hover:bg-green-200">
                  <input 
                        type="checkbox"
                        name="isCustomized"
                        id="isCustomized"
                        checked={customized === "true"}
                        onChange={handleCustomized}
                        className="cursor-pointer accent-pink-500 "
                  />
                  <label className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-yellow-400 to-red-500" htmlFor="isCustomized"> Customized</label>
              </div>
              <div className="col-span-2 grid gap-1 justify-items-center ">
                {customized === ""  && selectedOption === "" ?  null  : 
                  <div className="flex"> 
                    <button className="p-1 text-white bg-red1 border-2 text-xs border-red-700 rounded-lg hover:bg-red-400 " onClick={handleClear}>Clear</button>    
                  </div>
                }  
              </div>   
        </div>
);
}