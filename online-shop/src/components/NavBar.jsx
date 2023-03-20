import React from "react";
import { useState, useContext } from "react";
import AppContext from "../AppContext";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountMenu from "./AccountMenu";
import {
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  getAuth,
  signOut,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Logo from "./Logo";

function PositionedMenu() {
  const {setUserState, setUserId,firestore,auth,setIsAdmin,setUserLoaded,setUserData} = useContext(AppContext);
  async function signIn(signInProvider) {
    const result = await signInWithPopup(auth, signInProvider);
    const user = result.user;
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      console.log("onAuthStateChanged ran");
      setUserState("userloading");
      setUserId(user.uid);
      if (user.uid === "PN4JqXrjsGfTsCUEEmaR5NO6rNF3") {
        setIsAdmin(true);
      }
      firestore.readAllUserIds().then((ids) => {
        if (ids.includes(user.uid)) {

        } else {

          firestore.createNewUser(
            {
              uid: user.uid,
              name: user.displayName,
              email: user.email,
              emailVerified: user.emailVerified,
              phoneNumber: "",
              deliveryAddress: [],
              contactPerson: [],
              isAnonymous: user.isAnonymous,
              orders: [],
              cart: [],
              favoriteItems: [],
              payments: []
            },
            user.uid
          );
        }
      });
    } 
  }

  async function FacebookSignIn() {
    signInWithPopup(getAuth(), new FacebookAuthProvider());
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
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ bgcolor: "green" }}
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
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={()=>{signIn(new GoogleAuthProvider())}}>
          <FcGoogle className="mr-2" />
          Login With Google
        </MenuItem>
        <MenuItem onClick={()=>{signIn(new FacebookAuthProvider())}}>
          <FaFacebook className="mr-2" />
          Login With Facebook
        </MenuItem>
      </Menu>
    </div>
  );
}

const userMenu = ["My Account", "Orders History", "Logout"];

const NavBar = () => {
  const {userdata, setUserData,auth,setUserLoaded,setUserState,setUserId,setCart} = useContext(AppContext);
  async function logOutClick() {
    await signOut(auth)
    setUserId(null);
    setUserData(null);
    setUserLoaded(true);
    setUserState("guest");
    setCart([]);
    console.log("logged out");

  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap bg-teal-500 w-full h-16 ">
      <Logo/>

        <div className="flex flex-row mr-5 ">
          {userdata ? (
            <AccountMenu
              userdata={userdata}
              signout={logOutClick}
            />
          ) : (
            <PositionedMenu />
          )}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default NavBar;


  