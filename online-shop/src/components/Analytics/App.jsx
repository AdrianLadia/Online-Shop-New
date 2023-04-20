import React from "react";
import InventoryTable from "./InventoryTable";
import { useEffect, useState, createContext, useContext } from "react";
import { getAuth, onAuthStateChanged, connectAuthEmulator } from "firebase/auth";
import { LogInBox } from "./LogInBox";
import { LogOutBox } from "./LogOutBox";
import useWindowDimensions from "./utils/UseWindowDimensions";
import { MenuBar } from "./MenuBar";
import { MenuBarMobile } from "./MenuBarMobile";
import {FaRegListAlt} from 'react-icons/fa' 
import AppContext from "../../AppContext";

const App = () => {
  const {firestore,setCategories} = useContext(AppContext)

  // connectAuthEmulator(auth, "http://localhost:9099");

  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null)
  const [customized, setCustomized] = useState(null)
  const [selectedName,setSelectedName] = useState(null)
  const [products,setProducts] = useState([])
  const { width } = useWindowDimensions();
  const [screenSizeMobile, setScreenSizeMobile] = useState()
  const [showMenu, setShowMenu] =useState(false)
  
  // console.log(screenSizeMobile)
  
  const handleProducts = (option1) => {
    setProducts(option1);
  };  
  
  const handleTableContent = (option1, option2, option3) => {
    setSelectedOption(option1);
    setCustomized(option2);
    setSelectedName(option3);
  };  

  const handleToggle = () => {
    setShowMenu(!showMenu);
  };
  
  useEffect(()=>{
    if (width < 1146) {
      return setScreenSizeMobile(true);
     }else {
      if(showMenu === true){
        setShowMenu(!showMenu);
      } 
      return setScreenSizeMobile(false);
      
     }
  },[width])

  useEffect(()=>{
    firestore.readAllIdsFromCollection('Categories').then((category) => {
      setCategories(category)
    })
  },[])


  useEffect(() => {
    if (loggedIn) {
      if (user.email === "ladiaadrian@gmail.com" || "valletigio54@gmail.com") {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    }
  }, [loggedIn]);

  return (
    <div>
      <div className=" overflow-hidden bg-gradient-to-r h-screen from-green-200 via-cyan-200 to-emerald-200">

                        {screenSizeMobile === true ?(
                          <div className="flex justify-start absolute top-13 left-1 ml-0 xs:ml-4 ">
                              <button className=" mt-2 mr-2 p-3 text-3xl 2xs:text-4xl rounded-lg text-green-700 hover:text-emerald-500 " onClick={handleToggle}><FaRegListAlt/></button>
                          </div>)
                        :
                         (null)} 

              <div className="h-5/6 w-screen flex mt-16 justify-center">           
                  <>
                   
                        <>  
                          {screenSizeMobile === false ? 
                              (<MenuBar callback={handleTableContent} products={products}/>)
                            : null
                          }
                        </>
                    
                  </>
                  
                        <>
                          {showMenu === false ?  
                            (<>
                                <InventoryTable callback={handleProducts} name={selectedName} category={selectedOption} customized={customized}/>
                            </>
                            )
                          :
                            (<> 
                                {screenSizeMobile === true ?
                                    (<MenuBarMobile callback={handleTableContent} products={products}/>)
                                :
                                  (null)
                                }
                            </>
                            )
                          }
                        </>
                </div>
      </div>
    </div>
  );
};
export default App;
