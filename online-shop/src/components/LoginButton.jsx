import React, { useEffect } from 'react';
import AppContext from '../AppContext';
import { useContext, useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import {
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  height: '20%',
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

const LoginButton = (props) => {
  const position = props.position;
  const [openUnsupportedBrowserModal, setOpenUnsupportedBrowserModal] = useState(false);
  const [openPhoneNumberModal, setOpenPhoneNumberModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [confirmObject, setConfirmObject] = useState(null); 
  const [OTP, setOTP] = useState('');
  let recaptchaVerifier = null;
  let handleCloseGuestSignInModal = props.handleCloseGuestSignInModal;

  if (handleCloseGuestSignInModal == null) {
    handleCloseGuestSignInModal = () => {};
  } else {
    handleCloseGuestSignInModal = props.handleCloseGuestSignInModal;
  }

  const { auth, isAppleDevice, isAndroidDevice, isGoogleChrome, isSupportedBrowser } = useContext(AppContext);

  // useEffect(() => {
  //   if (captchaSolved) {
  //     console.log('signInWithPhoneNumber')
  //     signInWithPhoneNumber(auth, '+639178927206', recaptchaVerifier).then((confirmationResult) => {
  //       // SMS sent. Prompt user to type the code from the message, then sign the
  //       // user in with confirmationResult.confirm(code).
  //       console.log('sms sent')
  //       window.confirmationResult = confirmationResult;
  //       console.log(confirmationResult)
  //       // ...
  //     }).catch((error) => {
  //       console.log(error)
  //       // ...
  //     });
  //   }
  // }, [captchaSolved]);

  async function setUpRecaptcha(number) {
    const recaptchaVerifier = new RecaptchaVerifier(
      
      'captcha',
      {
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log(response);
        },
      },
      auth
    );
    recaptchaVerifier.render();
    return signInWithPhoneNumber(auth, number, recaptchaVerifier);
  }
 
  async function getOTP() {
    const response = await setUpRecaptcha('+639178927206');
    if (response.verificationId) {
      setConfirmObject(response);
      setShowOTPInput(true);
    }
  }

  async function verifyOTP() {
    await confirmObject.confirm(OTP);
  }

  async function signIn(signInProvider) {
    handleCloseGuestSignInModal();
    setAnchorEl(null);
    let result;
    if (isGoogleChrome) {
      result = await signInWithPopup(auth, signInProvider);
    }
    if (isAppleDevice) {
      result = await signInWithPopup(auth, signInProvider);
    } else {
      result = await signInWithRedirect(auth, signInProvider);
    }
    const user = result.user;
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
          <FcGoogle className="mr-2" />
          Login With Google
        </MenuItem>
        <MenuItem
          onClick={() => {
            signIn(new FacebookAuthProvider());
          }}
          className="hover:bg-color10c"
        >
          <FaFacebook className="mr-2" />
          Login With Facebook
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenPhoneNumberModal(true);
          }}
          className="hover:bg-color10c"
        >
          <FaFacebook className="mr-2" />
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
              <div className='flex flex-col'>
                <TextField
                  onChange={(event) => setOTP(event.target.value)}
                  label="Input OTP"
                  variant="outlined"
                />
                <Button sx={{marginTop:2}} onClick={verifyOTP}>Submit OTP</Button>
              </div>
            ) : (
              <>
                <TextField
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  label="Outlined"
                  variant="outlined"
                />
                <Button onClick={getOTP}>Sign In</Button>
                <div id="captcha" />
              </>
            )}
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default LoginButton;
