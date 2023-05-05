import React, { useRef, useEffect, useState, useContext } from 'react';
import { TiArrowBack } from 'react-icons/ti';

const DisplayMessagesUser = (props) => {
  const message = props.message;
  const dateTime = props.dateTime;
  const userRole = props.userRole;
  const loggedInUserId = props.loggedInUserId;
  const dummy = useRef(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

  function handleBoth() {
    setShowDetails(!showDetails);
    // updateMessages();
  }

  return (
    <div className="flex flex-row-reverse items-start h-max mr-0.5">
      <div className="flex items-center justify-center w-2/12 h-full rounded-full sm:w-1/12 mt-3">
        <div className="w-16 h-16 bg-gradient-to-tr from-color10c to-color60 border-4 border-color60 rounded-full sm:h-20 sm:w-20">
          <div className="flex items-center justify-center h-full text-2xl font-bold text-white uppercase">
            {userRole[0]}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end justify-center w-10/12 max-h-full lg:w-3/5">
        <>
          <div className="flex justify-center max-w-full max-h-full mt-3 text-color10a md:mr-2 hyphens-auto">
            {showDetails ? (
              <>
                <p>Sent at {dateTime}</p>
                <p>
                  <TiArrowBack className="mt-1 " />
                </p>
              </>
            ) : (
              <p className=" mr-2">{userRole}</p>
            )}
          </div>

          <div
            className="items-start justify-start max-w-full max-h-full p-3 px-4 m-2 my-2 text-white bg-gradient-to-tl from-color60 to-color10c cursor-help md:p-4 md:px-6 rounded-3xl"
            onClick={handleBoth}
          >
            <p>{message}</p>
          </div>

          <div ref={dummy}></div>
        </>
      </div>
    </div>
  );
};

export default DisplayMessagesUser;
