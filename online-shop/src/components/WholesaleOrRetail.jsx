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
    <div className="bg-color60  flex justify-center">
        <button
          onClick={onWholesaleClick}
          className=" mr-2 mt-5 flex-none font-semibold p-3 rounded-full bg-color10a lg:w-40 hover:bg-orange-50  hover:animate-pulse"
        >
          Wholesale
        </button>
        <button
          onClick={onRetailClick}
          className="mt-5 flex-none font-semibold p-3 rounded-full bg-color10a lg:w-40 hover:bg-orange-50  hover:animate-pulse"
        >
          Retail
        </button>
      </div>
  )
}

export default WholesaleOrRetail
