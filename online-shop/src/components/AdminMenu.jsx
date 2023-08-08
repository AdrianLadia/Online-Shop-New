import React from 'react';
import { IoArrowBackCircle } from 'react-icons/io5';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import AdminInventory from './AdminInventory';
import { useEffect, useState } from 'react';
import AdminCreatePayment from './AdminCreatePayment';
import AdminOrders from './AdminOrders';
import AppContext from '../AppContext';
import { BsBoxes, BsBagCheck, BsGraphUp } from 'react-icons/bs';
import { HiOutlineCash } from 'react-icons/hi';
import App from './Analytics/App';
import { RiAdminFill } from 'react-icons/ri';
import UseWindowDimensions from './UseWindowDimensions';
import AdminChatMenu from './AdminChatMenu';
import { HiOutlineChatAlt } from 'react-icons/hi';
import AdminAddOrEditItem from './AdminAddOrEditItem';
import CustomerAnalytics from './customerAnalytics/App';
import { VscGraph } from 'react-icons/vsc';
import CompanyDashboard from './CompanyDashboard/CompanyDashboard';
import { RiDashboard2Line } from "react-icons/ri";
import Tooltip from '@mui/material/Tooltip';
import AffiliateClaimRequest from './AdminAffiliateClaimRequest';
import { TbAffiliate } from "react-icons/tb";

const AdminMenu = () => {
  const { firestore, allUserData, setAllUserData, categories } = React.useContext(AppContext);
  const { width } = UseWindowDimensions();
  const [refresh, setRefresh] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigateTo = useNavigate();
  const [selectedMenu, setSelectedMenu] = React.useState('Claim Request');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    firestore.readAllProducts().then((data) => {
      setProducts(data);
    });
  }, []);

  
  return (
    // NAV BAR
    // bg-gradient-to-r from-colorbackground via-color2 to-color1
    <div className="flex flex-col">
      
      {/* handleClickCustomerAnalytics */}
      {/* HERO */}
      <div>
        {/* {selectedMenu === 'Dashboard' && <AdminOrders users={users} />} */}
        {selectedMenu === 'Inventory' && (
          <AdminInventory
            products={products}
            categories={categories}
            refresh={refresh}
            setRefresh={setRefresh}
            setSelectedMenu={setSelectedMenu}
          />
        )}
        {selectedMenu === 'Add Item' && (
          <AdminAddOrEditItem
            products={products}
            categories={categories}
            refresh={refresh}
            setRefresh={setRefresh}
            addOrEditItem={'Add'}
            setSelectedMenu={setSelectedMenu}
          />
        )}
        {selectedMenu === 'Edit Item' && (
          <AdminAddOrEditItem
            products={products}
            categories={categories}
            refresh={refresh}
            setRefresh={setRefresh}
            addOrEditItem={'Edit'}
            setSelectedMenu={setSelectedMenu}
          />
        )}

        {selectedMenu === 'Create Payment' && <AdminCreatePayment users={allUserData} setUsers={setAllUserData} />}
        {selectedMenu === 'Customer Orders' && <AdminOrders users={allUserData} />}
        {selectedMenu === 'Analytics' && <App />}
        {selectedMenu === 'Customer Analytics' && <CustomerAnalytics />}
        {selectedMenu === 'Admin Chat' && <AdminChatMenu />}
        {selectedMenu === 'Company Dashboard' && <CompanyDashboard />}
        {selectedMenu === 'Claim Request' && <AffiliateClaimRequest />}
      </div>
    </div>
  );
};

export default AdminMenu;
