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
    <div className="bg-green-300  flex justify-center">
        <button
          onClick={onWholesaleClick}
          className=" mr-2 mt-5 flex-none w-auto p-3 border rounded-full bg-green-100 lg:w-40 hover:bg-green-500 hover:animate-pulse"
        >
          Wholesale
        </button>
        <button
          onClick={onRetailClick}
          className="mt-5 flex-none w-auto p-3 border rounded-full bg-green-100 lg:w-40 hover:bg-green-500 hover:animate-pulse"
        >
          Retail
        </button>
      </div>
  )
}

export default WholesaleOrRetail
