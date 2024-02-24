import React from 'react';
import { useState, useEffect, lazy, Suspense } from 'react';
// import AdminInventory from './AdminInventory';
// import AdminCreatePayment from './AdminCreatePayment';
// import AdminOrders from './AdminOrders';
import AppContext from '../AppContext';
import App from './Analytics/App';
// import AdminAddOrEditItem from './AdminAddOrEditItem';
// import CustomerAnalytics from './customerAnalytics/App';
// import CompanyDashboard from './CompanyDashboard/CompanyDashboard';
// import AffiliateClaimRequest from './AdminAffiliateClaimRequest';
// import AdminNavBar from './AdminNavBar';
// import AdminDelivery from './AdminDelivery';
import { Routes, Route } from 'react-router-dom';
// import AdminVoidPayment from './AdminVoidPayment';
// import AdminEditOrders from './AdminEditOrders';
// import AdminCustomerAccount from './AdminCustomerAccount';
import SuspenseFallback from '../SuspenseFallback';

// const AdminCustomerAccount = lazy(() => import('./AdminCustomerAccount'))
const AdminNavBar = lazy(() => import('./AdminNavBar'));
const CompanyDashboard = lazy(() => import('./CompanyDashboard/CompanyDashboard'));
const AdminCreatePayment = lazy(() => import('./AdminCreatePayment'));
const AdminOrders = lazy(() => import('./AdminOrders'));
const AdminAddOrEditItem = lazy(() => import('./AdminAddOrEditItem'));
const CustomerAnalytics = lazy(() => import('./customerAnalytics/App'));
const AffiliateClaimRequest = lazy(() => import('./AdminAffiliateClaimRequest'));
const AdminDelivery = lazy(() => import('./AdminDelivery'));
const AdminVoidPayment = lazy(() => import('./AdminVoidPayment'));
const AdminEditOrders = lazy(() => import('./AdminEditOrders'));
const AdminCustomerAccount = lazy(() => import('./AdminCustomerAccount'));

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
        {/* <Route
          path="inventory"
          element={
            <div>
              <AdminNavBar />
              <AdminInventory products={products} categories={categories} refresh={refresh} setRefresh={setRefresh} />
            </div>
          }
        /> */}
        <Route
          path="customerAccount"
          element={
            <div>
              <Suspense fallback={<SuspenseFallback />}>
                <AdminNavBar />
                <AdminCustomerAccount />
              </Suspense>
            </div>
          }
        />
        <Route
          path="addItem"
          element={
            <div>
              <Suspense fallback={<SuspenseFallback />}>
                <AdminNavBar />
                <AdminAddOrEditItem
                  products={products}
                  categories={categories}
                  refresh={refresh}
                  setRefresh={setRefresh}
                  addOrEditItem={'Add'}
                />
              </Suspense>
            </div>
          }
        />
        <Route
          path="editItem"
          element={
            <div>
              <Suspense fallback={<SuspenseFallback />}>
                <AdminNavBar />
                <AdminAddOrEditItem
                  products={products}
                  categories={categories}
                  refresh={refresh}
                  setRefresh={setRefresh}
                  addOrEditItem={'Edit'}
                />
              </Suspense>
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
          path="voidPayment"
          element={
            <div>
              <Suspense fallback={<SuspenseFallback />}>
              <AdminNavBar />
              <AdminVoidPayment users={allUserData} setUsers={setAllUserData} />
              </Suspense>
            </div>
          }
        />

        <Route
          path="orders"
          element={
            <div>
              <Suspense fallback={<SuspenseFallback />}>
                <AdminNavBar />
                <AdminOrders users={allUserData} />
              </Suspense>
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
              <Suspense fallback={<SuspenseFallback />}>
                <AdminNavBar />
                <CustomerAnalytics />
              </Suspense>
            </div>
          }
        />
        <Route
          path="companyDashboard"
          element={
            <div>
              <Suspense fallback={<SuspenseFallback />}>
                <AdminNavBar />
                <CompanyDashboard products={products} />
              </Suspense>
            </div>
          }
        />
        <Route
          path="affiliateClaimRequest"
          element={
            <div>
              <Suspense fallback={<SuspenseFallback />}>
                <AdminNavBar />
                <AffiliateClaimRequest />
              </Suspense>
            </div>
          }
        />
        <Route
          path="delivery"
          element={
            <div>
              <Suspense fallback={<SuspenseFallback />}>
                <AdminNavBar />
                <AdminDelivery />
              </Suspense>
            </div>
          }
        />
        <Route
          path="editOrders"
          element={
            <div>
              <Suspense fallback={<SuspenseFallback />}>
              <AdminNavBar />
              <AdminEditOrders />
              </Suspense>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default Admin;
