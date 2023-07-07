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
import {AiFillHome} from 'react-icons/ai';

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
    // console.log('logged out');
  }

  function storeClick() {
    navigateTo('/');
  }

  function homeClick() {
    navigateTo('/');
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap bg-gradient-to-r from-color10c via-color10c to-color60 w-full h-16 ">
        <Logo onClick={storeClick} />
        <div className='hover:cursor-pointer' onClick={homeClick}>
          <AiFillHome size={35} color='#6bd0ff'/>
        </div>
        <div className="flex flex-row 2xs:mr-5 ">
          {userdata ? <AccountMenu userdata={userdata} signout={logOutClick} /> : <LoginButton position={'left'} />}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
