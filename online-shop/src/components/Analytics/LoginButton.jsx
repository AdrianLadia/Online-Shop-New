import React from "react";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  GoogleAuthProvider,
  signInWithRedirect,

  FacebookAuthProvider,
  getAuth,

} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

import {FaSignInAlt} from 'react-icons/fa' 

const LoginButton = (props) => {

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
        sx={{
          bgcolor: "#34c6eb",
          padding: "15px",
          border: '2px solid #3A98B9',
          color: "black",
          fontWeight: "semiBold",
          fontHeight: "20px",
          borderRadius: "27px",
          fontSize: "17px",
          gap: "8px",
          ":hover": {
            backgroundColor: "#97DEFF",
            border: '2px solid #93BFCF',
          },
        }}
      >
        <FaSignInAlt/>Login
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
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
};

export default LoginButton;
