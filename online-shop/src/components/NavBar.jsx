import React from 'react';
import { useState, useContext } from 'react';
import AppContext from '../AppContext';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountMenu from './AccountMenu';
import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, getAuth, signOut } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import Logo from './Logo';
import LoginButton from './LoginButton';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';

const userMenu = ['My Account', 'Orders History', 'Logout'];

const NavBar = () => {
  const { userdata, setUserData, auth, setUserLoaded, setUserState, setUserId, setCart } = useContext(AppContext);
  const navigateTo = useNavigate();

  async function logOutClick() {
    await signOut(auth);
    setUserId(null);
    setUserData(null);
    setUserLoaded(true);
    setUserState('guest');
    setCart({});
    navigateTo('/');
    console.log('logged out');
  }

  function storeClick() {
    navigateTo('/');
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap bg-gradient-to-r from-color10c via-color10c to-color60 w-full h-16 ">
        <Logo onClick={storeClick} />
        <div className="flex flex-col justify-center">
          <div className="text-white text-sm cursor-pointer hover:underline" onClick={storeClick}>
            {/* <Typography id="modal-modal-title" variant="h5" component="h2"> */}
            We are on <strong>SOFT OPENING!</strong>
            {/* </Typography> */}
          </div>
          <div className="flex justify-center text-white text-sm cursor-pointer hover:underline" onClick={storeClick}>
            {/* <Typography id="modal-modal-title" variant="h5" component="h2"> */}
            <strong> More Products Soon </strong>.
            {/* </Typography> */}
          </div>
          
        </div>

        <div className="flex flex-row 2xs:mr-5 ">
          {userdata ? <AccountMenu userdata={userdata} signout={logOutClick} /> : <LoginButton position={'left'} />}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
