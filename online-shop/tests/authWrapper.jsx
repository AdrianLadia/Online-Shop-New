import {getAuth, onAuthStateChanged, connectAuthEmulator,initializeApp } from "firebase/auth";
import firebaseConfig from "../src/firebase_config";
import firebase from 'firebase/compat/app';
import { signInWithPopup,GoogleAuthProvider } from "firebase/auth";

firebase.initializeApp(firebaseConfig);
const auth = getAuth();

signInWithRedirect(auth, new GoogleAuthProvider());

export {auth};
