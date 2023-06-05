import React from 'react';
import { IoArrowBackCircle } from 'react-icons/io5';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import AdminInventory from './AdminInventory';
import { useEffect, useState } from 'react';
import firestoredb from '../firestoredb';
import AdminCreatePayment from './AdminCreatePayment';
import AdminOrders from './AdminOrders';
import AppContext from '../AppContext';
import {ThemeProvider } from '@mui/material/styles';
import theme from "../colorPalette/MaterialUITheme";
import { BsBoxes, BsBagCheck, BsGraphUp } from "react-icons/bs";
import { HiOutlineCash } from "react-icons/hi";
import App from './Analytics/App';
import { RiAdminFill } from "react-icons/ri";
import Divider from "@mui/material/Divider";
import UseWindowDimensions from "./UseWindowDimensions";
import AdminChatMenu from "./AdminChatMenu";
import { HiOutlineChatAlt } from "react-icons/hi";

const AdminMenu = () => {
  const {products, firestore } = React.useContext(AppContext);

  const {width } = UseWindowDimensions();
  const [refresh, setRefresh] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigateTo = useNavigate();
  const [selectedMenu, setSelectedMenu] = React.useState('Admin Chat');
 
  let [categories, setCategories] = useState([]);
  let [users, setUsers] = useState([]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickInventory = () => {
    setAnchorEl(null);
    setSelectedMenu('Inventory');
  };

  const handleClickCreatePayment = () => {
    setAnchorEl(null);
    setSelectedMenu('Create Payment');
  };

  const handleClickCustomerOrders = () => {
    setAnchorEl(null);
    setSelectedMenu('Customer Orders');
  };

  const handleClickAnalytics = () => {
    setAnchorEl(null);
    setSelectedMenu('Analytics');
  }

  const handleClickAdminChat = () => {
    setAnchorEl(null);
    setSelectedMenu('Admin Chat');
  }

  const handleBack = () => {
    navigateTo('/shop');
  };

  useEffect(() => {
    firestore.readAllCategories().then((c) => {
      setCategories(c);
    });
    firestore.readAllUsers().then((user) => {
      setUsers(user);
    });
  }, [refresh]);

  function responsiveSize(){
    if(width < 650){
      return 25
    }else{
      return 35
    }
  }

  function responsiveIcon(){
    if(width < 650){
      return "mt-3 text-blue1"
    }else{
      return "mt-2 text-blue1"
    }
  }

  return (
    // NAV BAR
    // bg-gradient-to-r from-colorbackground via-color2 to-color1 
    <div className="flex flex-col">
      <div className="flex flex-row w-full justify-between bg-gradient-to-r from-color60 via-color10c to-color60 py-3">
        {/* Back Button */}
        <IoArrowBackCircle id='backToStoreButton' size={40} className=" mt-1 2xs:ml-6 text-white hover:text-color10b cursor-pointer" onClick={handleBack} />
          
        <div className='flex sm:mr-14'>
            <RiAdminFill size={responsiveSize()} className={responsiveIcon()}/>
          {/* <span className='mt-2 text-blue1 text-2xl font-semibold first-letter:text-3xl t'>Admin</span> */}
        </div>

          {/* Menu Button */}
        <div className='flex-row'>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >          
            <GiHamburgerMenu id='hamburgerAdmin' size={36} className='-mr-4 2xs:mr-6 text-white hover:text-color10b '/>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 1,
              sx: {
                width: 220,
                display: "flex",
                flexDirection:"column",
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: .4,
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
                  right: 30,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem className='hover:bg-color10b w-11/12 justify-start p-2 ml-2' id='inventoryMenu' onClick={handleClickInventory}> <BsBoxes size={19}/>     <span>Inventory</span></MenuItem>
            {/* <Divider className="mt-0.5"/>   */}
            <MenuItem className='hover:bg-color10b w-11/12 justify-start p-2 ml-2' id='createPaymentMenu' onClick={handleClickCreatePayment}> <HiOutlineCash size={19}/>     <span>Create Payment</span></MenuItem>
            {/* <Divider className="mt-0.5"/>   */}
            <MenuItem className='hover:bg-color10b w-11/12 justify-start p-2 ml-2' id='customerOrdersMenu' onClick={handleClickCustomerOrders}> <BsBagCheck size={19}/>     <span>Customer Orders</span></MenuItem>
            {/* <Divider className="mt-0.5"/>   */}
            <MenuItem className='hover:bg-color10b w-11/12 justify-start p-2 ml-2' id='Analytics' onClick={handleClickAnalytics}> <BsGraphUp size={18}/>     <span>Analytics</span></MenuItem>
            {/* <Divider className="mt-0.5"/>   */}
            <MenuItem className='hover:bg-color10b w-11/12 justify-start p-2 ml-2' id='Admin Chat' onClick={handleClickAdminChat}> <HiOutlineChatAlt size={20}/>     <span>Admin Chat</span></MenuItem>
          </Menu>
        </div>
      </div>
      {/* HERO */}
      <div>
        {/* {selectedMenu === 'Dashboard' && <AdminOrders users={users} />} */}
        {selectedMenu === 'Inventory' && (
          <AdminInventory products={products} categories={categories} refresh={refresh} setRefresh={setRefresh}/>
        )}
        {selectedMenu === 'Create Payment' && <AdminCreatePayment users={users} setUsers={setUsers} />}
        {selectedMenu === 'Customer Orders' && <AdminOrders users={users} />}
        {selectedMenu === 'Analytics' && <App />}
        {selectedMenu === 'Admin Chat' && <AdminChatMenu />}
      </div>
    </div>
  );
};

export default AdminMenu;
