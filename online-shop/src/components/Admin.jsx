import React from 'react';
import { useState, useEffect } from 'react';
import AdminInventory from './AdminInventory';
import AdminCreatePayment from './AdminCreatePayment';
import AdminOrders from './AdminOrders';
import AppContext from '../AppContext';
import App from './Analytics/App';
import AdminChatMenu from './AdminChatMenu';
import AdminAddOrEditItem from './AdminAddOrEditItem';
import CustomerAnalytics from './customerAnalytics/App';
import CompanyDashboard from './CompanyDashboard/CompanyDashboard';
import AffiliateClaimRequest from './AdminAffiliateClaimRequest';
import AdminNavBar from './AdminNavBar';
import { Routes, Route } from 'react-router-dom';

const Admin = () => {
  const { firestore, allUserData, setAllUserData, categories } = React.useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    firestore.readAllProducts().then((data) => {
      setProducts(data);
    });
  }, []);
  return (
    <div>
      <Routes>
        <Route
          path="inventory"
          element={
            <div>
              <AdminNavBar />
              <AdminInventory products={products} categories={categories} refresh={refresh} setRefresh={setRefresh} />
            </div>
          }
        />
        <Route
          path="addItem"
          element={
            <div>
              <AdminNavBar />
              <AdminAddOrEditItem
                products={products}
                categories={categories}
                refresh={refresh}
                setRefresh={setRefresh}
                addOrEditItem={'Add'}
              />
            </div>
          }
        />
        <Route
          path="editItem"
          element={
            <div>
              <AdminNavBar />
              <AdminAddOrEditItem
                products={products}
                categories={categories}
                refresh={refresh}
                setRefresh={setRefresh}
                addOrEditItem={'Edit'}
              />
            </div>
          }
        />
        <Route
          path="createPayment"
          element={
            <div>
              <AdminNavBar />
              <AdminCreatePayment users={allUserData} setUsers={setAllUserData} />
            </div>
          }
        />

        <Route
          path="orders"
          element={
            <div>
              <AdminNavBar />
              <AdminOrders users={allUserData} />
            </div>
          }
        />
        <Route
          path="itemAnalytics"
          element={
            <div>
              <AdminNavBar />
              <App />
            </div>
          }
        />
        <Route
          path="customerAnalytics"
          element={
            <div>
              <AdminNavBar />
              <CustomerAnalytics />
            </div>
          }
        />
        <Route
          path="chatMenu"
          element={
            <div>
              <AdminNavBar />
              <AdminChatMenu />
            </div>
          }
        />
        <Route
          path="companyDashboard"
          element={
            <div>
              <AdminNavBar />
              <CompanyDashboard />
            </div>
          }
        />
        <Route
          path="AffiliateClaimRequest"
          element={
            <div>
              <AdminNavBar />
              <AffiliateClaimRequest />
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default Admin;
