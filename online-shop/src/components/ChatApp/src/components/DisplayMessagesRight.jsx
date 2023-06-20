import React, { useRef, useEffect, useState, useContext } from 'react';
import { TiArrowBack } from 'react-icons/ti';
import AppContext from '../../../../AppContext';
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import dataManipulation from '../../../../../utils/dataManipulation';
import Image from '../../../ImageComponents/Image';

const DisplayMessagesUser = (props) => {

  const { isadmin } = useContext(AppContext);
  const message = props.message;
  let dateTime = props.dateTime;
  const datamanipulation = new dataManipulation(); 
  dateTime = datamanipulation.convertDateTimeStampToDateString(dateTime)
  
  
  const user = props.user;
  const loggedInUserId = props.loggedInUserId;
  const read = props.read;
  const image= props.image;

  const dummy = useRef(null);
  const [showDetails, setShowDetails] = useState(false);

  function viewImage() {

  }


  useEffect(() => {
    if(isadmin === false){
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  console.log(message)

  return (
    
    <div className="flex flex-row-reverse items-start h-max mr-0.5">
      <div className="flex items-center justify-center w-2/12 rounded-full h-full lg:w-1/12 mt-3">
        <div className="w-16 h-16 sm:h-20 sm:w-20 bg-gradient-to-tr from-color10c to-color60 border-4 border-color60 rounded-full">
          <div className="flex items-center justify-center h-full text-2xl font-bold text-white uppercase">
            {user[0]}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end justify-center w-10/12 max-h-full lg:w-3/5">
        <>
          <div className="flex justify-center max-w-full max-h-full mt-3 text-color10a md:mr-2 hyphens-auto">
            {showDetails ? (
              <>
                <p>Sent at {dateTime},</p>
                {read? (<p> Seen</p>) : (null)}
                <p><TiArrowBack className="mt-1"/></p>
              </>
            ) : (
              <p className=" mr-2">{user}</p>
            )}
          </div>
          <div className='flex flex-row-reverse items-end'>
            <div
              className="items-start justify-start max-w-full max-h-full p-3 px-4 m-2 my-2 text-white bg-gradient-to-tl from-color60 to-color10c cursor-help md:p-4 md:px-6 rounded-3xl"
              onClick={()=>{setShowDetails(!showDetails)}}
              >
              <p>
                  <p>{message}</p>
                  {/* {image ? <img src={image} alt='this should be an image' className='h-64 w-64'/> : null} */}
                  {image ? <Image imageUrl={image} className='h-64 w-64'/> : null}
              </p>
            </div>
            <div className='mb-2 -mr-2.5 text-color60'>
              {read? (<BiCheckCircle/>) : (<BiXCircle/>)}
            </div>
          </div>
        </>
      </div>
          <div ref={dummy}/>
    </div>
  );
};

export default DisplayMessagesUser;
