import React, { useEffect } from 'react'
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

// Import the functions you need from the SDKs you need

const LoginMenu = (props) => {

    // FirebaseUI config.
    var uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectUrl) {
              var user = authResult.user;
              var credential = authResult.credential;
              var isNewUser = authResult.additionalUserInfo.isNewUser;
              var providerId = authResult.additionalUserInfo.providerId;
              var operationType = authResult.operationType;
              console.log(authResult)
              // Do something with the returned AuthResult.
              // Return type determines whether we continue the redirect
              // automatically or whether we leave that to developer to handle.
              return true;
            },
            signInFailure: function(error) {
              // Some unrecoverable error occurred during sign-in.
              // Return a promise when error handling is completed and FirebaseUI
              // will reset, clearing any UI. This commonly occurs for error code
              // 'firebaseui/anonymous-upgrade-merge-conflict' when merge conflict
              // occurs. Check below for more details on this.
              console.log(error)
              return handleUIError(error);
            }},
        signInSuccessUrl: '/',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.GoogleAuthProvider.PROVIDER_ID
        //   firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          
        ],
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        tosUrl: 'www.paperboy.ph',
        // Privacy policy url/callback.
        privacyPolicyUrl: function() {
          window.location.assign('www.paperboy.ph');
        }
      };

      
        var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(props.auth);
        ui.start('#firebaseui-auth-container', uiConfig);
      


  return (
    <div className='grid h-screen place-items-center'>
      <div  id="firebaseui-auth-container"></div>
    </div>
  )
}

export default LoginMenu
