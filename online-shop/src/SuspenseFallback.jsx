import React from 'react'
import { CircularProgress } from '@mui/material'

const SuspenseFallback = () => {
  return (
    <div className='w-screen h-screen items-center flex justify-center bg-colorbackground'>
      <CircularProgress  size='20vh' style={{color:'green'}}/>
    </div>
  )
}

export default SuspenseFallback
