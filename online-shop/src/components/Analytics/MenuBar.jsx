import React, {useState, useEffect} from 'react'
import { CheckBoxes } from "./CheckBoxes";
import { SearchBar } from "./SearchBar";
import LogoutButton from "./LogoutButton";

export const MenuBar = ({callback, products}) => {

  const [selectedOption, setSelectedOption] = useState(null)
  const [customized, setCustomized] = useState(null)
  const [selectedName,setSelectedName] = useState(null)
  
  const handleSelectedOption = (option1, option2) => {
    setSelectedOption(option1);
    setCustomized(option2);
  };  
  
  const handleSelectedName = (option1) => {
    setSelectedName(option1);
  };  

  callback(selectedOption, customized, selectedName)
  
  return (
    <div className="flex flex-col justify-between  w-2/12 p-4 mr-1 ml-3 rounded-lg border-2 bg-gradient-to-b from-green-100 to-emerald-100 border-green-700">   
        <div className=" font-semibold self-start w-full h-1/6 justify-center relative"> <CheckBoxes name={selectedName} callback={handleSelectedOption}/></div>
        <div className=" font-semibold self-center w-4/5 h-5/6 ml-2"> <SearchBar callback={handleSelectedName} name={selectedName} products={products}/></div>
        {/* <div className=" font-semibold self-center"> <LogoutButton setAuthorized={false}/></div>  */}
    </div>
  )
}
