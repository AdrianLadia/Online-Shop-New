import { Typography } from '@mui/material'
import React from 'react'
import { useState } from 'react'

const WholesaleOrRetail = (props) => {

    const setWholesale = props.setWholesale
    const setRetail = props.setRetail

    function onWholesaleClick() {
        setWholesale(true);
        setRetail(false);
      }
    
      function onRetailClick() {
        setWholesale(false);
        setRetail(true);
      }

  return (
    <div className="from-colorbackground via-color2 to-color1 flex justify-center">
        <button
          onClick={onWholesaleClick}
          // className=" mr-1 mt-5 flex-none font-semibold p-3 rounded-full bg-color10a hover:bg-color30 hover:border-color10a lg:w-40 hover:animate-pulse"
          // className=" mr-1 mt-5 flex-none font-semibold p-3 rounded-full bg-gradient-to-r from-color30 to-color10a lg:w-40 hover:animate-pulse"
          className=" mr-1 mt-5 flex-none font-semibold p-3 rounded-full bg-color10a w-32 lg:w-40 hover:animate-pulse"
        >
          <Typography>
          Wholesale
          </Typography>
        </button>
        <button
          onClick={onRetailClick}
          // className="ml-1 mt-5 flex-none font-semibold p-3 rounded-full bg-color10a hover:bg-color30 hover:border-color10a lg:w-40 hover:animate-pulse"
          // className="ml-1 mt-5 flex-none font-semibold p-3 rounded-full bg-gradient-to-l from-color30 to-color10a lg:w-40 hover:animate-pulse"
          className="ml-1 mt-5 flex-none font-semibold p-3 rounded-full bg-color10a w-32 lg:w-40 hover:animate-pulse"
        >
          <Typography>
            Retail
          </Typography>
        </button>
      </div>
  )
}

export default WholesaleOrRetail
