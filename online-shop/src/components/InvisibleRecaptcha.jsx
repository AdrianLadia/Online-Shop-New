import React from 'react';
import { useState, useContext, useRef, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import AppContext from '../AppContext';
import { Typography, TextField, CircularProgress } from '@mui/material';

const InvisibleRecaptcha = (props) => {
  const recaptchaVerifierRef = useRef(null);
  const { auth, alertSnackbar } = useContext(AppContext);
  const phoneNumber = props.phoneNumber;
  const [code, setCode] = useState('');
  const confirmationResult = props.confirmationResult;
  const setConfirmationResult = props.setConfirmationResult;
  const loading = props.loading;
  const setLoading = props.setLoading;

  useEffect(() => {
    recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'sign-in-button', {
      size: 'invisible',
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.

        onSignInSubmit();
      },
    });
  }, []);

  function signIn() {
    if (phoneNumber == '') {
      alertSnackbar('error', 'Please enter a valid phone number');
      return;
    }

    if (phoneNumber.length != 12) {
      alertSnackbar('error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    signInWithPhoneNumber(auth, '+' + phoneNumber, recaptchaVerifierRef.current)
      .then((result) => {
        setLoading(false);

        setConfirmationResult(result);
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error during sign-in', error);
        recaptchaVerifierRef.current.reset();
      });
  }

  function onSubmitCode() {
    if (confirmationResult) {
      setLoading(true);
      confirmationResult
        .confirm(code)
        .then((userCredential) => {
          setLoading(false);

          // handle signed in user
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  }

  return (
    <div className="flex flex-col">
      {confirmationResult == null ? (
        <>
          <button className="bg-color10b rounded-lg p-3" id="sign-in-button" onClick={signIn}>
            {loading ? <CircularProgress size={20} /> : <span className="text-white">Receive OTP</span>}
          </button>
          <div className="mt-5">
            <Typography>
              We will send an OTP to your phone number. Check and input the OTP once message is sent.
            </Typography>
          </div>
        </>
      ) : (
        <div>
          <div className="flex flex-col">
            <Typography id="modal-modal-title" variant="h8" component="h8" sx={{ marginBottom: 1.5 }}>
              We have sent an OTP to your phone number. Check and input the OTP below.
            </Typography>
            <TextField
              value={code}
              onChange={(event) => setCode(event.target.value)}
              label="Input OTP"
              variant="outlined"
            />
            <div className="mt-5 flex justify-center">
              <button className="rounded-lg p-3 bg-color10b text-white ml-2" onClick={onSubmitCode}>
                {loading ? <CircularProgress size={20} /> : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvisibleRecaptcha;
