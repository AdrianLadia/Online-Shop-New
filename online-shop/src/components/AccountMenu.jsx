import React, { useContext, use, useEffect } from "react";
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
import { RiAdminLine } from "react-icons/ri";
import { Typography } from "@mui/material";
import ClipLoader from 'react-spinners/ClipLoader';

const AccountMenu = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const {
    userdata,
    isadmin,
    refreshUser,
    setRefreshUser,
    setUserState,
    userstate
   } = useContext(AppContext);

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
    navigateTo("/shop");
  }

  function myOrdersClick() {
    setUserState("userloading");
    setRefreshUser(!refreshUser);
    navigateTo("/myorders/orderList");
  }

  function accountStatementCLick() {
    setUserState("userloading");
    setRefreshUser(!refreshUser);
    navigateTo("/accountstatement");
  }

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }} >
        {/* <Typography sx={{ minWidth: 100 }}>Contact</Typography>
          <Typography sx={{ minWidth: 100 }}>Profile</Typography> */}
        <Tooltip title="My Profile">
          <IconButton
            id = "accountMenu"
            onClick={handleClick}
            // size="small"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            className='flex justify-center items-center hover:bg-blue1'
            sx={{width: 48, height: 48}}
          >
            <Avatar sx={{ width: 36, height: 36, bgcolor:'#6bd0ff',justifyItems:"end"}} >
              <Typography color='white' sx={{ fontWeight:600}} className="flex justify-center items-center">
                {userstate == 'userloaded' ? <p className="mt-0.5">{userdata.name[0].toUpperCase()}</p> : <ClipLoader size={20} color="#ffffff"/>}
              </Typography>
            </Avatar>
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
          elevation: 1,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1,
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
              right: 17,
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
        <MenuItem id='storeMenu' onClick={storeClick} className='hover:bg-color10b'>
          <FaStore size={17} />
          <span className="ml-5 mt-1">Store</span>
        </MenuItem>
        <Divider />
        {/* PROFILE MENU */}
        <MenuItem id='profileMenu' onClick={profileClick} className='hover:bg-color10b'>
          <CgProfile size={17} />
          <span className="ml-5">Profile</span>
        </MenuItem>
        {/* Order History  */}
        <MenuItem id='myOrdersMenu' onClick={myOrdersClick} className='hover:bg-color10b'>
          <AiOutlineHistory size={17} />
          <span className="ml-5">My Orders</span>
        </MenuItem>
        {/* Account Statement */}
        <MenuItem id='accountStatementMenu' onClick={accountStatementCLick} className='hover:bg-color10b'>
          <BsBook size={17} />
          <span className="ml-5">Account Statement</span>
        </MenuItem>
        <Divider />
        {/* ADMIN MENU */}
        
        <MenuItem id='settingsMenu' className='hover:bg-color10b'>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <span>Settings</span>
        </MenuItem>
        <MenuItem id='logoutMenu' onClick={props.signout} className='hover:bg-red-400'>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <span>Logout</span>
        </MenuItem>
        {isadmin ? (
          <div>
            <Divider className="mt-1 mb-1"/>
            <MenuItem id='adminMenu' onClick={adminClick} className='hover:bg-slate-300'>
              <RiAdminLine size={21} className="-ml-.5 font-bold text-blue1" />
              <span className="ml-5 mt-1 text-blue1">Admin</span>
            </MenuItem>
          </div>
        ) : null}
      </Menu>
    </React.Fragment>
  );
};

export default AccountMenu
