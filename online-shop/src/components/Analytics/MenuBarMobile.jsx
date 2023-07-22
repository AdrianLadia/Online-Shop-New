import React, {useState, useEffect} from 'react'
import { CheckBoxesMobile } from "./CheckBoxesMobile";
import { SearchBarMobile } from "./SearchBarMobile";
import LogoutButton from "./LogoutButton";


export const MenuBarMobile = ({callback, products}) => {

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
      <div className="flex flex-col justify-between w-11/12 h-full p-4 mt-10 rounded-lg border-2 bg-gradient-to-b from-green-100 to-emerald-100 border-green-700 ">   
          <div className="flex font-semibold justify-center w-full p-1 h-2/6 "> <SearchBarMobile callback={handleSelectedName} name={selectedName} products={products}/> </div>
          <div className="flex justify-center w-full h-4/6 "> <CheckBoxesMobile name={selectedName} callback={handleSelectedOption}/> </div>
          {/* <div className='self-center'> <LogoutButton setAuthorized={false}/></div>  */}
      </div>
    )
}
export default MenuBarMobile;