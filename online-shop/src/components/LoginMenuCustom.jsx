import { Typography } from '@mui/material';
import React from 'react'


const LoginMenuCustom = (props) => {

    const google_provider = new GoogleAuthProvider();
    const facebook_provider = new FacebookAuthProvider();

    function Google(auth){
        signInWithRedirect(auth, google_provider)

    }

    function Facebook(auth){
        signInWithRedirect(auth, facebook_provider);

    }

    return (
    
    <div className='grid h-screen place-items-center'>
      <button className='rounded-full bg-green-300 p-3' onClick={() => Google(props.auth) }>
        <div>
        </div>
        </button>
    <button className='rounded-full bg-blue-300 p-3' onClick={() => Facebook(props.auth) }>Log in With Facebook</button>
    </div>
  )
}

export default LoginMenuCustom
