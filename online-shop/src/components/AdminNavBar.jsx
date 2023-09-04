import React from 'react';
import { useContext } from 'react';
import UseWindowDimensions from './UseWindowDimensions';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { HiOutlineChatAlt } from 'react-icons/hi';
import { GiHamburgerMenu } from 'react-icons/gi';
import { BsBoxes, BsBagCheck, BsGraphUp } from 'react-icons/bs';
import { IoArrowBackCircle } from 'react-icons/io5';
import { RiAdminFill } from 'react-icons/ri';
import { RiDashboard2Line } from 'react-icons/ri';
import { HiOutlineCash } from 'react-icons/hi';
import { VscGraph } from 'react-icons/vsc';
import { TbAffiliate } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import menuRules from '../../utils/classes/menuRules';
import AppContext from '../AppContext';
import {CiDeliveryTruck} from 'react-icons/ci';
import {MdOutlineCancelPresentation} from 'react-icons/md';

const AdminNavBar = () => {
  const { width } = UseWindowDimensions();
  const { userdata } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = React.useState(false);
  const open = Boolean(anchorEl);
  const navigateTo = useNavigate();
  const rules = new menuRules(userdata.userRole);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickCompanyDashboard = () => {
    setAnchorEl(null);
    navigateTo('/admin/companyDashboard');
  };

  const handleClickInventory = () => {
    setAnchorEl(null);
    navigateTo('/admin/inventory');
  };

  const handleClickCreatePayment = () => {
    setAnchorEl(null);
    navigateTo('/admin/createPayment');
  };

  const handleClickVoidPayment = () => {
    setAnchorEl(null);
    navigateTo('/admin/voidPayment');
  }

  const handleClickCustomerOrders = () => {
    setAnchorEl(null);
    navigateTo('/admin/orders');
  };

  const handleClickAnalytics = () => {
    setAnchorEl(null);
    navigateTo('/admin/itemAnalytics');
  };

  const handleClickCustomerAnalytics = () => {
    setAnchorEl(null);
    navigateTo('/admin/customerAnalytics');
  };

  const handleClickAdminChat = () => {
    setAnchorEl(null);
    navigateTo('/admin/chatMenu');
  };

  const handleClickClaimRequest = () => {
    setAnchorEl(null);
    navigateTo('/admin/affiliateClaimRequest');
  };

  const handleClickAddItem = () => {
    setAnchorEl(null);
    navigateTo('/admin/addItem');
  };

  const handleClickEditItem = () => {
    setAnchorEl(null);
    navigateTo('/admin/editItem');
  };

  const handleBack = () => {
    navigateTo('/shop');
  };

  const handleClickDelivery = () => {
    setAnchorEl(null);
    navigateTo('/admin/delivery');
  }

  function responsiveSize() {
    if (width < 650) {
      return 25;
    } else {
      return 35;
    }
  }

  function responsiveIcon() {
    if (width < 650) {
      return 'mt-5 text-blue1';
    } else {
      return 'mt-3 text-blue1';
    }
  }

  return (
    <div className="flex flex-row w-full justify-between bg-gradient-to-r from-color60 via-color10c to-color60 py-3">
      {/* Back Button */}
      <Tooltip title="Back" placement="bottom-end">
        <Button>
          <IoArrowBackCircle
            id="backToStoreButton"
            size={40}
            className=" mt-1 2xs:ml-6 text-white hover:text-red-300 cursor-pointer"
            onClick={handleBack}
          />
        </Button>
      </Tooltip>

      <div className="flex ">
        <RiAdminFill size={responsiveSize()} className={responsiveIcon()} />
        {/* <span className='mt-2 text-blue1 text-2xl font-semibold first-letter:text-3xl t'>Admin</span> */}
      </div>

      {/* Menu Button */}
      <div className="flex ">
        <Tooltip title="Menu" placement="bottom-start">
          <Button
            className="mt-1"
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <GiHamburgerMenu
              onClick={handleClick}
              id="hamburgerAdmin"
              size={36}
              className="-mr-4 2xs:mr-6 text-white hover:text-color10b "
            />
          </Button>
        </Tooltip>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            elevation: 1,
            sx: {
              width: 220,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 0.4,
              '& .MuiAvatar-root': {
                // width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {rules.checkIfUserAuthorized('companyDashboard') ? (
            <MenuItem
              className="hover:bg-color10b w-11/12 justify-start p-2 ml-2"
              id="Company Dashboard"
              onClick={handleClickCompanyDashboard}
            >
              {' '}
              <RiDashboard2Line size={20} />   <span>  Company Dashboard</span>
            </MenuItem>
          ) : null}
          {rules.checkIfUserAuthorized('addItem') ? (
            <MenuItem
              className="hover:bg-color10b w-11/12 justify-start p-2 ml-2"
              id="inventoryMenu"
              onClick={handleClickAddItem}
            >
              {' '}
              <BsBoxes size={19} />     <span>Add Item</span>
            </MenuItem>
          ) : null}
          {rules.checkIfUserAuthorized('editItem') ? (
            <MenuItem
              className="hover:bg-color10b w-11/12 justify-start p-2 ml-2"
              id="inventoryMenu"
              onClick={handleClickEditItem}
            >
              {' '}
              <BsBoxes size={19} />     <span>Edit Item</span>
            </MenuItem>
          ) : null}
          {rules.checkIfUserAuthorized('inventory') ? (
            <MenuItem
              className="hover:bg-color10b w-11/12 justify-start p-2 ml-2"
              id="inventoryMenu"
              onClick={handleClickInventory}
            >
              {' '}
              <BsBoxes size={19} />     <span>Inventory</span>
            </MenuItem>
          ) : null}
          {/* <Divider className="mt-0.5"/>   */}
          {rules.checkIfUserAuthorized('createPayment') ? (
            <MenuItem
              className="hover:bg-color10b w-11/12 justify-start p-2 ml-2"
              id="createPaymentMenu"
              onClick={handleClickCreatePayment}
            >
              {' '}
              <HiOutlineCash size={19} />     <span>Create Payment</span>
            </MenuItem>
          ) : null}
          {rules.checkIfUserAuthorized('voidPayment') ? (
            <MenuItem
              className="hover:bg-color10b w-11/12 justify-start p-2 ml-2"
              id="voidPaymentMenu"
              onClick={handleClickVoidPayment}
            >
              {' '}
              <MdOutlineCancelPresentation size={19} />     <span>Void Payment</span>
            </MenuItem>
          ) : null}
          {/* <Divider className="mt-0.5"/>   */}
          {rules.checkIfUserAuthorized('orders') ? (
            <MenuItem
              className="hover:bg-color10b w-11/12 justify-start p-2 ml-2"
              id="customerOrdersMenu"
              onClick={handleClickCustomerOrders}
            >
              {' '}
              <BsBagCheck size={19} />     <span>Customer Orders</span>
            </MenuItem>
          ) : null}
          {/* <Divider className="mt-0.5"/>   */}
          {rules.checkIfUserAuthorized('itemAnalytics') ? (
            <MenuItem
              className="hover:bg-color10b w-11/12 justify-start p-2 ml-2"
              id="Analytics"
              onClick={handleClickAnalytics}
            >
              {' '}
              <VscGraph size={20} />     <span>Item Analytics</span>
            </MenuItem>
          ) : null}

          {/* <Divider className="mt-0.5"/>   */}
          {rules.checkIfUserAuthorized('customerAnalytics') ? (
            <MenuItem
              className="hover:bg-color10b w-11/12 justify-start p-2 ml-2"
              id="Customer Analytics"
              onClick={handleClickCustomerAnalytics}
            >
              {' '}
              <BsGraphUp size={17} />     <span>Customer Analytics</span>
            </MenuItem>
          ) : null}
          {/* <Divider className="mt-0.5"/>   */}
          {rules.checkIfUserAuthorized('adminChat') ? (
            <MenuItem
              className="hover:bg-color10b w-11/12 justify-start p-2 ml-2"
              id="Admin Chat"
              onClick={handleClickAdminChat}
            >
              {' '}
              <HiOutlineChatAlt size={20} />     <span>Admin Chat</span>
            </MenuItem>
          ) : null}
          {rules.checkIfUserAuthorized('affiliateClaimRequest') ? (
            <MenuItem
              className="hover:bg-color10b w-11/12 justify-start p-2 ml-2"
              id="Affiliate Claim"
              onClick={handleClickClaimRequest}
            >
              {' '}
              <TbAffiliate size={20} />     <span>Claim Requests</span>
            </MenuItem>
          ) : null}
          {rules.checkIfUserAuthorized('delivery') ? (
            <MenuItem
              className="hover:bg-color10b w-11/12 justify-start p-2 ml-2"
              id="delivery"
              onClick={handleClickDelivery}
            >
              {' '}
              <CiDeliveryTruck size={20} />     <span>Delivery</span>
            </MenuItem>
          ) : null}
        </Menu>
      </div>
    </div>
  );
};

export default AdminNavBar;
