import { Button } from '@mui/material'
import React from 'react'
import { useState, createContext } from 'react'


const CategoryButton = (props) => {


    function OnClick() {
        props.onCategoryClick(props.category)
    }

    
  return (
        <button className='flex-none w-auto p-3 border rounded-full bg-green-100 lg:w-40 hover:bg-green-500 hover:animate-pulse' onClick={OnClick} > {props.category}
            {/* <img alt='poster' src={GetImageLink(props.category)} ></img> */}
        </button>

  )
}

export default CategoryButton
