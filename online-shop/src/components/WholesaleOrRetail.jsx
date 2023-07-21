import { Typography } from '@mui/material';
import React from 'react';
import { useState } from 'react';

const WholesaleOrRetail = (props) => {
  const setWholesale = props.setWholesale;
  const setRetail = props.setRetail;

  function onWholesaleClick() {
    setWholesale(true);
    setRetail(false);
  }

  function onRetailClick() {
    setWholesale(false);
    setRetail(true);
  }

  return (
    <div className="from-colorbackground  via-color2 to-color1 flex flex-col items-center drop-shadow-xl  ">
      <div className="flex">
        <Typography className="text-2xl font-semibold mt-5 mb-5">Purchase items by</Typography>
      </div>
      <div className="flex flex-row">
        <button
          onClick={onWholesaleClick}
          // className=" mr-1 mt-5 flex-none font-semibold p-3 rounded-full bg-color10a hover:bg-color30 hover:border-color10a lg:w-40 hover:animate-pulse"
          // className=" mr-1 mt-5 flex-none font-semibold p-3 rounded-full bg-gradient-to-r from-color30 to-color10a lg:w-40 hover:animate-pulse"
          className=" mr-1  flex-none font-semibold p-3 rounded-full bg-color10b w-2/5 2xs:w-32 lg:w-40 hover:animate-pulse"
        >
          <Typography>BOX</Typography>
        </button>
        <button
          onClick={onRetailClick}
          // className="ml-1  flex-none font-semibold p-3 rounded-full bg-color10a hover:bg-color30 hover:border-color10a lg:w-40 hover:animate-pulse"
          // className="ml-1  flex-none font-semibold p-3 rounded-full bg-gradient-to-l from-color30 to-color10a lg:w-40 hover:animate-pulse"
          className="ml-1  flex-none font-semibold p-3 rounded-full bg-color10b w-2/5 2xs:w-32 lg:w-40 hover:animate-pulse"
        >
          <Typography>PACK</Typography>
        </button>
      </div>
    </div>
  );
};

export default WholesaleOrRetail;
