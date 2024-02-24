import React from 'react';
import { useState, useContext,startTransition } from 'react';
import AppContext from '../AppContext';
import Button from '@mui/material/Button';
import AccountMenu from './AccountMenu';
import Logo from './Logo';
import LoginButton from './LoginButton';
import { useNavigate } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import onLogoutClick from '../../utils/classes/onLogoutClick';
import { FaShoppingCart } from 'react-icons/fa';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

const NavBar = () => {
  const { userdata, setUserData, auth, setUserLoaded, setUserState, setUserId, setCart, cloudfirestore } =
    useContext(AppContext);
  const navigateTo = useNavigate();

  async function logOutClick() {
    await signOut(auth);
    setUserId(null);
    setUserData(null);
    setUserLoaded(true);
    setUserState('guest');
    setCart({});

    startTransition(() => navigateTo('/'));
  
  }

  function storeClick() {
    startTransition(() => navigateTo('/'));
  }

  function homeClick() {
    startTransition(() => navigateTo('/'));
  }

  function cartClick() {
    startTransition(() => navigateTo('/shop'));
  }

  return (
    <div>
      <div className="flex items-center justify-between  bg-color10c w-full h-16 ">
        <Logo onClick={storeClick} />
        <div className="flex flex-row items-center lg:gap-5 mr-5">
          <Tooltip title="Shop">
            <IconButton aria-label="Shop" size="large" color="primary">
              <FaShoppingCart className="cursor-pointer" size={35} color="#69b05c" onClick={cartClick} />
            </IconButton>
          </Tooltip>
          <div className="hover:cursor-pointer " onClick={homeClick}>
            <Tooltip title="Home">
              <IconButton aria-label="Home" size="large" color="primary">
                <AiFillHome className="cursor-pointer" size={35} color="#69b05c" />
              </IconButton>
            </Tooltip>
          </div>
          <div className="flex flex-row">
            {userdata ? (
              
              <AccountMenu
                userdata={userdata}
                signout={() => {
                  new onLogoutClick(
                    setUserId,
                    setUserData,
                    setUserLoaded,
                    setUserState,
                    setCart,
                    navigateTo,
                    auth
                  ).runMain();
                }}
              />
            ) : (
              <LoginButton position={'left'} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
