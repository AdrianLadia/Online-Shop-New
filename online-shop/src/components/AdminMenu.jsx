import React from 'react';
import AdminInventory from './AdminInventory';
import { useEffect, useState } from 'react';
import AdminCreatePayment from './AdminCreatePayment';
import AdminOrders from './AdminOrders';
import AppContext from '../AppContext';
import App from './Analytics/App';
import AdminChatMenu from './AdminChatMenu';
import AdminAddOrEditItem from './AdminAddOrEditItem';
import CustomerAnalytics from './customerAnalytics/App';
import CompanyDashboard from './CompanyDashboard/CompanyDashboard';
import AffiliateClaimRequest from './AdminAffiliateClaimRequest';


const AdminMenu = () => {
  const { firestore, allUserData, setAllUserData, categories } = React.useContext(AppContext);
  const [refresh, setRefresh] = useState(false);
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
