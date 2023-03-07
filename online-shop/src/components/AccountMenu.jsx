import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import AppContext from "../AppContext";
import { useNavigate } from "react-router-dom";
import { FaStore } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { AiOutlineHistory } from "react-icons/ai";
import { BsBook } from "react-icons/bs";
import { GrUserAdmin } from "react-icons/gr";

const AccountMenu = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [
    userdata,
    setUserData,
    isadmin,
    db,
    cart,
    setCart,
    favoriteitems,
    setFavoriteItems,
    userId,
    setUserId,
    refreshUser,
    setRefreshUser,
    userLoaded,
    setUserLoaded,
    deliveryaddress,
    setDeliveryAddress,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    userstate,
    setUserState,
  ] = useContext(AppContext);
  const open = Boolean(anchorEl);
  const navigateTo = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function adminClick() {
    navigateTo("/admin");
  }

  function profileClick() {
    navigateTo("/profile");
  }

  function storeClick() {
    setUserState("userloading");
    setRefreshUser(!refreshUser);
    navigateTo("/");
  }

  function myOrdersClick() {
    setUserState("userloading");
    setRefreshUser(!refreshUser);
    navigateTo("/myorders");
  }

  function accountStatementCLick() {
    setUserState("userloading");
    setRefreshUser(!refreshUser);
    navigateTo("/accountstatement");
  }

  

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        {/* <Typography sx={{ minWidth: 100 }}>Contact</Typography>
          <Typography sx={{ minWidth: 100 }}>Profile</Typography> */}
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>{userdata.name[0]}</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={storeClick}>
          <FaStore size={17} />
          <span className="ml-5">Store</span>
        </MenuItem>
        <Divider />
        {/* PROFILE MENU */}
        <MenuItem onClick={profileClick}>
          <CgProfile size={17} />
          <span className="ml-5">Profile</span>
        </MenuItem>
        {/* Order History  */}
        <MenuItem onClick={myOrdersClick}>
          <AiOutlineHistory size={17} />
          <span className="ml-5">My Orders</span>
        </MenuItem>
        {/* Account Statement */}
        <MenuItem onClick={accountStatementCLick}>
          <BsBook size={17} />
          <span className="ml-5">Account Statement</span>
        </MenuItem>
        <Divider />
        {/* ADMIN MENU */}

        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <span>Settings</span>
        </MenuItem>
        <MenuItem onClick={props.signout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <span>Logout</span>
        </MenuItem>
        {isadmin ? (
          <div>
            <Divider />
            <MenuItem onClick={adminClick}>
              <GrUserAdmin size={17} className="ml-0.5" />
              <span className="ml-5 mt-1">Admin</span>
            </MenuItem>
          </div>
        ) : null}
      </Menu>
    </React.Fragment>
  );
};

export default AccountMenu
