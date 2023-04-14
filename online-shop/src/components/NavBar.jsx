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

// function PositionedMenu() {
//  
// }

const userMenu = ['My Account', 'Orders History', 'Logout'];

const NavBar = () => {
  const { userdata, setUserData, auth, setUserLoaded, setUserState, setUserId, setCart } = useContext(AppContext);
  async function logOutClick() {
    await signOut(auth);
    setUserId(null);
    setUserData(null);
    setUserLoaded(true);
    setUserState('guest');
    setCart([]);
    console.log('logged out');
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap bg-gradient-to-r from-color10c via-color10c to-color60 w-full h-16 ">
        <Logo />

        <div className="flex flex-row mr-5 ">
          {userdata ? <AccountMenu userdata={userdata} signout={logOutClick} /> :<LoginButton position={'left'} />}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default NavBar;
