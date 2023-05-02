import React, { useEffect, useRef, useState } from 'react';
import { TiArrowForward } from 'react-icons/ti';

const MessagesClient = (props) => {
  const userName = props.userName;
  const message = props.message;
  const dateTime = props.dateTime;
  const dummy = useRef(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }, []);


  return (
    <div className="flex items-start h-max">
      <div className="flex items-center justify-center w-2/12 h-full rounded-full sm:w-1/12">
         
        <div className="w-16 h-16 bg-indigo-300 border-4 border-indigo-400 rounded-full sm:h-20 sm:w-20">
          <div className="flex items-center justify-center h-full text-2xl font-bold text-white uppercase">
            {userName[0]}
          </div>
          {/* <div className='flex items-center justify-center h-full text-2xl font-bold text-white uppercase'>{messages.userId}</div> */}
        </div>
      </div>

      <div className="flex flex-col items-start justify-center w-11/12 max-h-full lg:w-3/5">
        <>
          <div className="flex justify-center max-w-full max-h-full mt-3 text-indigo-700 md:ml-2 hyphens-auto">
            {showDetails ? (
              <>
                <p>
                  <TiArrowForward className="mt-1 ml-4" />
                </p>
                <p>Sent at {dateTime}</p>
              </>
            ) : (
              <p className="ml-7">{userName}</p>
            )}
          </div>

          <div
            className="max-w-full max-h-full p-3 px-4 m-2 my-2 mr-4 text-white bg-indigo-400 md:p-4 md:px-6 rounded-3xl cursor-help"
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

export default MessagesClient;
