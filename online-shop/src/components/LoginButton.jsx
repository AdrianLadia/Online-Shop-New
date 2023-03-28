import React from 'react'
import AppContext from '../AppContext';
import { useContext } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';


const LoginButton = (props) => {

    const position = props.position
    const handleCloseGuestSignInModal = props.handleCloseGuestSignInModal

    const {auth} = useContext(AppContext);

      async function signIn(signInProvider) {
        handleCloseGuestSignInModal()
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
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: props.position,
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

export default LoginButton
