import React, { useContext, use, useEffect } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AppContext from '../AppContext';
import { useNavigate } from 'react-router-dom';
import { FaStore } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { AiOutlineHistory } from 'react-icons/ai';
import { BsBook } from 'react-icons/bs';
import { RiAdminLine } from 'react-icons/ri';
import { Typography } from '@mui/material';
import ClipLoader from 'react-spinners/ClipLoader';
import { AiOutlineMessage } from 'react-icons/ai';
import { useLocation } from 'react-router-dom';
import Badge from '@mui/material/Badge';

const AccountMenu = (props) => {
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { userdata, isadmin, refreshUser, setRefreshUser, setUserState, userstate, userId,unreadOrderMessages, unreadCustomerServiceMessages } = useContext(AppContext);
  const totalUnreadMessages = unreadOrderMessages + unreadCustomerServiceMessages;

  const open = Boolean(anchorEl);

  const navigateTo = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function adminClick() {
    navigateTo('/admin');
  }

  function profileClick() {
    navigateTo('/profile');
  }

  function storeClick() {
    setUserState('userloading');
    setRefreshUser(!refreshUser);
    navigateTo('/shop');
  }

  function myOrdersClick() {
    setUserState('userloading');
    setRefreshUser(!refreshUser);
    navigateTo('/myorders/orderList');
  }

  function accountStatementCLick() {
    setUserState('userloading');
    setRefreshUser(!refreshUser);
    navigateTo('/accountstatement');
  }

  function customerServiceClick() {
  
    navigateTo('/orderChat', { state: { orderReference: userId, isInquiry: true, backButtonRedirect: pathname } });
  }

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        {/* <Typography sx={{ minWidth: 100 }}>Contact</Typography>
          <Typography sx={{ minWidth: 100 }}>Profile</Typography> */}
        <Tooltip title="My Profile">
          <IconButton
            id="accountMenu"
            onClick={handleClick}
            // size="small"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            className="flex justify-center items-center hover:bg-blue1"
            sx={{ width: 48, height: 48 }}
          >
            <Badge badgeContent={totalUnreadMessages} color="error">
              <Avatar sx={{ width: 36, height: 36, bgcolor: '#6bd0ff', justifyItems: 'end' }}>
                <Typography color="white" sx={{ fontWeight: 600 }} className="flex justify-center items-center">
                  {userstate == 'userloaded' ? (
                    <p className="mt-0.5">{userdata.name ? userdata.name[0].toUpperCase() : '?'}</p>
                  ) : (
                    <ClipLoader size={20} color="#ffffff" />
                  )}
                </Typography>
              </Avatar>
            </Badge>
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
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1,
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
              right: 17,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem id="storeMenu" onClick={storeClick} className="hover:bg-color10b">
          <FaStore size={17} />
          <span className="ml-5 mt-1">Store</span>
        </MenuItem>
        <Divider />
        {/* PROFILE MENU */}
        {/* <MenuItem id='profileMenu' onClick={profileClick} className='hover:bg-color10b'>
          <CgProfile size={17} />
          <span className="ml-5">Profile</span>
        </MenuItem> */}
        {/* Order History  */}

        <MenuItem id="myOrdersMenu" onClick={myOrdersClick} className="hover:bg-color10b">
          <Badge  badgeContent={unreadOrderMessages} color="error">
            <div className='mr-2'>
            <AiOutlineHistory  size={17} />
            </div>
          </Badge>
          <span className="ml-5">My Orders</span>
        </MenuItem>
        {/* Account Statement */}
        <MenuItem id="accountStatementMenu" onClick={accountStatementCLick} className="hover:bg-color10b">
          <BsBook size={17} />
          <span className="ml-5">Account Statement</span>
        </MenuItem>
        <Divider />
        {/* ADMIN MENU */}

        <MenuItem id="settingsMenu" className="hover:bg-color10b">
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <span>Settings</span>
        </MenuItem>
        <MenuItem id="logoutMenu" onClick={props.signout} className="hover:bg-red1">
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <span>Logout</span>
        </MenuItem>
        <Divider className="mt-1 mb-1" />
        <MenuItem id="adminMenu" onClick={customerServiceClick} className="hover:bg-slate-300">
          <Badge badgeContent={unreadCustomerServiceMessages} color="error">
            <div className='mr-1'>
              <AiOutlineMessage size={21} className="-ml-.5 font-bold text-blue1" />
            </div>
          </Badge>
          <span className="ml-3.5 text-blue1">Customer Service</span>
        </MenuItem>
        {isadmin ? (
          <div>
            <Divider className="mt-1 mb-1" />
            <MenuItem id="adminMenu" onClick={adminClick} className="hover:bg-slate-300">
              <RiAdminLine size={21} className="-ml-.5 font-bold text-blue1" />
              <span className="ml-5 mt-1 text-blue1">Admin</span>
            </MenuItem>
          </div>
        ) : null}
      </Menu>
    </React.Fragment>
  );
};

export default AccountMenu;
