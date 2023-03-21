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

function PositionedMenu() {
  const {auth} = useContext(AppContext);

  async function signIn(signInProvider) {
    setAnchorEl(null);
    const result = await signInWithPopup(auth, signInProvider);
    const user = result.user;
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ bgcolor: 'green' }}
      >
        Login
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem
          onClick={() => {
            signIn(new GoogleAuthProvider());
          }}
        >
          <FcGoogle className="mr-2" />
          Login With Google
        </MenuItem>
        <MenuItem
          onClick={() => {
            signIn(new FacebookAuthProvider());
          }}
        >
          <FaFacebook className="mr-2" />
          Login With Facebook
        </MenuItem>
      </Menu>
    </div>
  );
}

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
      <div className="flex items-center justify-between flex-wrap bg-teal-500 w-full h-16 ">
        <Logo />

        <div className="flex flex-row mr-5 ">
          {userdata ? <AccountMenu userdata={userdata} signout={logOutClick} /> : <PositionedMenu />}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default NavBar;
