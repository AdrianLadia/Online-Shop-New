import React, { useEffect, useRef, useState } from 'react';
import { TiArrowForward } from 'react-icons/ti';

const DisplayMessagesAdmin = (props) => {
  const message = props.message;
  const dateTime = props.dateTime;
  const userRole = "Admin"
  const dummy = useRef(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }, []);


  return (
    <div className="flex items-start h-max ml-0.5">
      <div className="flex items-center justify-center w-2/12 h-full rounded-full sm:w-1/12 mt-3">
         
        <div className="w-16 h-16 bg-gradient-to-tl from-green2 to-green1 border-4 border-green1 rounded-full sm:h-20 sm:w-20 ">
          <div className="flex items-center justify-center h-full text-2xl font-bold text-white uppercase">
            {userRole[0]}
          </div>
          {/* <div className='flex items-center justify-center h-full text-2xl font-bold text-white uppercase'>{messages.userId}</div> */}
        </div>
      </div>

      <div className="flex flex-col items-start justify-center w-11/12 max-h-full lg:w-3/5">
        <>
          <div className="flex justify-center max-w-full max-h-full mt-3 text-green3 md:ml-2 hyphens-auto">
            {showDetails ? (
              <>
                <p>
                  <TiArrowForward className="mt-1" />
                </p>
                <p>Sent at {dateTime}</p>
              </>
            ) : (
              <p className="ml-2">{userRole}</p>
            )}
          </div>

          <div
            className="max-w-full max-h-full p-3 px-4 m-2 my-2 mr-4 text-white bg-gradient-to-tr from-green1 to-green2 md:p-4 md:px-6 rounded-3xl cursor-help"
            onClick={() => setShowDetails(!showDetails)}
          >
            <p>{message}</p>
          </div>

          <div ref={dummy}></div>
        </>
      </div>
    </div>
  );
};

export default DisplayMessagesAdmin;
