import React from "react";
import { useState, useContext } from "react";
import AppContext from "../AppContext";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountMenu from "./AccountMenu";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  FacebookAuthProvider,
  getAuth,
  signOut,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

function PositionedMenu() {

  function GoogleSignIn() {
    signInWithRedirect(getAuth(), new GoogleAuthProvider());
  }

  function FacebookSignIn(auth) {
    signInWithRedirect(getAuth(), new FacebookAuthProvider());
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
        <MenuItem onClick={GoogleSignIn}>
          <FcGoogle className="mr-2" />
          Login With Google
        </MenuItem>
        <MenuItem onClick={FacebookSignIn}>
          <FaFacebook className="mr-2" />
          Login With Facebook
        </MenuItem>
      </Menu>
    </div>
  );
}

const userMenu = ["My Account", "Orders History", "Logout"];

const NavBar = () => {
  const [userdata, setUserData] = useContext(AppContext);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap bg-teal-500 w-full h-16 ">
        <img
          className="ml-5 h-12 rounded-full"
          src="https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fstarpack.png?alt=media&token=e108388d-74f7-45a1-8344-9c6af612f053"
          alt="logo"
        ></img>

        <div className="flex flex-row mr-5 ">
          {userdata ? (
            <AccountMenu
              userdata={userdata}
              signout={() => signOut(getAuth())}
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
