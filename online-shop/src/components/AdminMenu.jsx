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

const AdminMenu = () => {
  const {products,firestore } = React.useContext(AppContext);

  const [refresh, setRefresh] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigateTo = useNavigate();
  const [selectedMenu, setSelectedMenu] = React.useState('Dashboard');
 
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

  const handleBack = () => {
    navigateTo('/');
  };

  useEffect(() => {

    firestore.readAllCategories().then((c) => {
      setCategories(c);
    });
    firestore.readAllUsers().then((user) => {
      setUsers(user);
    });
  }, [refresh]);

  useEffect(() => {}, []);

  return (
    // NAV BAR
    // bg-gradient-to-r from-colorbackground via-color2 to-color1 
    <div className="flex flex-col">
      <div className="flex flex-row w-full justify-between bg-gradient-to-r from-color60 via-color10c to-color60 py-3">
        {/* Back Button */}
        <IoArrowBackCircle id='backToStoreButton' size={40} className=" mt-1 ml-6 text-white hover:text-color10b cursor-pointer" onClick={handleBack} />
        <div>
          {/* Menu Button */}
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <GiHamburgerMenu id='hamburgerAdmin' size={36} className='mr-6 text-white hover:text-color10b'/>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 1,
              sx: {
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
                  right: 28,
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
            <MenuItem className='hover:bg-color10b' id='Analytics' onClick={handleClickAnalytics}> <BsGraphUp size={18}/>     <span>Analytics</span></MenuItem>
            <MenuItem className='hover:bg-color10b' id='inventoryMenu' onClick={handleClickInventory}> <BsBoxes size={19}/>     <span>Inventory</span></MenuItem>
            <MenuItem className='hover:bg-color10b' id='createPaymentMenu' onClick={handleClickCreatePayment}> <HiOutlineCash size={19}/>     <span>Create Payment</span></MenuItem>
            <MenuItem className='hover:bg-color10b' id='customerOrdersMenu' onClick={handleClickCustomerOrders}> <BsBagCheck size={19}/>     <span>Customer Orders</span></MenuItem>
          </Menu>
        </div>
      </div>
      {/* HERO */}
      <div>
        {selectedMenu === 'Dashboard' && <AdminOrders users={users} />}
        {selectedMenu === 'Inventory' && (
          <AdminInventory products={products} categories={categories} refresh={refresh} setRefresh={setRefresh}/>
        )}
        {selectedMenu === 'Create Payment' && <AdminCreatePayment users={users} setUsers={setUsers} />}
        {selectedMenu === 'Customer Orders' && <AdminOrders users={users} />}
        {selectedMenu === 'Analytics' && <App />}
      </div>
    </div>
  );
};

export default AdminMenu;
