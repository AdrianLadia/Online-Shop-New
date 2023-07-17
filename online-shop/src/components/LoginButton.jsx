import React, { useEffect } from 'react';
import AppContext from '../AppContext';
import { useContext, useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import {
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider ,
  signInWithRedirect,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import UnsupportedBrowserRedirect from './UnsupportedBrowserRedirect';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { set } from 'date-fns';
import TextField from '@mui/material/TextField';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import {GiSmartphone} from 'react-icons/gi'

const ReactPhoneInput = PhoneInput.default ? PhoneInput.default : PhoneInput;

const LoginButton = (props) => {
  const position = props.position;
  const [openUnsupportedBrowserModal, setOpenUnsupportedBrowserModal] = useState(false);
  const [openPhoneNumberModal, setOpenPhoneNumberModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [confirmObject, setConfirmObject] = useState(null);
  const [OTP, setOTP] = useState('');
  const [height, setHeight] = useState('20%');

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: height,
    transform: 'translate(-50%, -50%)',
    width: '95%',
    overflow: 'scroll',
  
    '@media (min-width: 1024px)': {
      width: '20%',
    },
  
    bgcolor: 'background.paper',
    border: '2px solid #69b05c',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
  };

  let recaptchaVerifier = null;
  let handleCloseGuestSignInModal = props.handleCloseGuestSignInModal;

  if (handleCloseGuestSignInModal == null) {
    handleCloseGuestSignInModal = () => {};
  } else {
    handleCloseGuestSignInModal = props.handleCloseGuestSignInModal;
  }

  const { auth, isAppleDevice, isAndroidDevice, isGoogleChrome, isSupportedBrowser } = useContext(AppContext);

  async function setUpRecaptcha(number) {
     recaptchaVerifier = new RecaptchaVerifier(
      'captcha',
      {
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
    
        },
      },
      auth
    );
    recaptchaVerifier.render();
    return signInWithPhoneNumber(auth, number, recaptchaVerifier);
  }

  function onPhoneNumberLogin() {
    setAnchorEl(false);
    setOpenPhoneNumberModal(true);
  }

  async function getOTP() {
    setAnchorEl(false);
    if (phoneNumber == '') {
      alert('Please enter a valid phone number');
      return;
    }

    if (phoneNumber.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }


    setHeight('40%')
    const response = await setUpRecaptcha('+' + phoneNumber);
    if (response.verificationId) {
      setConfirmObject(response);
      setShowOTPInput(true);
      
      recaptchaVerifier.clear();
    }
  }

  async function verifyOTP() {
    try {
      await confirmObject.confirm(OTP);
      setOpenPhoneNumberModal(false);
    }
    catch {
      alert ('Invalid OTP')
    }
  }

  async function signIn(signInProvider) {
    handleCloseGuestSignInModal();
    setAnchorEl(null);
    let result;
    if (isGoogleChrome) {
      result = await signInWithPopup(auth, signInProvider);
      return;
    }
    if (isAppleDevice) {
      result = await signInWithPopup(auth, signInProvider);
      return;
    }

    result = await signInWithRedirect(auth, signInProvider);
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    if (!isSupportedBrowser) {
      console.log('Setting to open unsupported modal');
      setOpenUnsupportedBrowserModal(true);
      return;
    }

    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <UnsupportedBrowserRedirect
        open={openUnsupportedBrowserModal}
        isSupportedBrowser={isSupportedBrowser}
        setOpen={setOpenUnsupportedBrowserModal}
      />
      <Button
        id="loginButton"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className="bg-color10b text-slate-800 font-bold hover:bg-color10c rounded-lg"
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
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        arrow={true}
        arrowSize={35}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 24,
              width: 10,
              height: 10,
              backgroundColor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        <MenuItem
          id="loginWithGoogle"
          onClick={() => {
            signIn(new GoogleAuthProvider());
          }}
          className="hover:bg-color10c"
        >
          <FcGoogle className="mr-3 ml-0.5" />
          Login With Google
        </MenuItem>
        <MenuItem
          onClick={() => {
            signIn(new FacebookAuthProvider());
          }}
          className="hover:bg-color10c"
        >
          <FaFacebook className="mr-3 ml-0.5" />
          Login With Facebook
        </MenuItem>
        <MenuItem
          onClick={onPhoneNumberLogin}
          className="hover:bg-color10c"
        >
          <GiSmartphone size={21} className="mr-2" />
          Login With Phone Number
        </MenuItem>
      </Menu>

      {openPhoneNumberModal && (
        <Modal
          open={openPhoneNumberModal}
          onClose={() => setOpenPhoneNumberModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {showOTPInput ? (
              <div className="flex flex-col">
                <Typography id="modal-modal-title" variant="h8" component="h8" sx={{marginBottom:1.5}}>
                  We have sent an OTP to your phone number. Check and input the OTP below.
                </Typography>
                <TextField onChange={(event) => setOTP(event.target.value)} label="Input OTP" variant="outlined" />
                <div className='mt-5 flex justify-center'>
                  <button className='rounded-lg p-3 bg-color10b text-white ml-2' onClick={verifyOTP}>
                    Submit OTP
                  </button>
                </div>
              </div>
            ) : (
              <div className='flex flex-col'>
                <ReactPhoneInput country={'ph'} value={phoneNumber} onChange={setPhoneNumber} />
                <div className='flex justify-center mt-5 mb-5'>
                  <button className='rounded-lg p-3 bg-color10b text-white ml-2' onClick={getOTP}>Sign In</button>
                </div>
                <div id="captcha" />
              </div>
            )}
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default LoginButton;
