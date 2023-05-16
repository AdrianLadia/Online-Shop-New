import React from 'react'

function Logo({onClick}) {
    return (<img onClick={onClick} className="cursor-pointer ml-1 lg:ml-5 h-12 rounded-full" src="https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fstarpack.png?alt=media&token=e108388d-74f7-45a1-8344-9c6af612f053" alt="logo"></img>);
  }

export default Logo
