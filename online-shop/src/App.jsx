import './App.css';
import NavBar from './components/NavBar';
import Shop from './components/Shop';
import { useEffect, useState } from 'react';
import AppContext from './AppContext';
import { Routes, Route } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import { getAuth, onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import AdminSecurity from './components/AdminSecurity';
import firebaseConfig from './firebase_config';
import firestoredb from './firestoredb';
import PersonalInfoForm from './components/PersonalInfoForm';
import CheckoutPage from './components/CheckoutPage';
import { CircularProgress, Typography } from '@mui/material';
import MyOrders from './components/MyOrders';
import AccountStatement from './components/AccountStatement';
import cloudFirestoreDb from './cloudFirestoreDb';
import { useNavigate } from 'react-router-dom';
import AppConfig from './AppConfig';
import './App.css';
import CheckoutSuccess from './components/CheckoutSuccess';
import CheckoutFailed from './components/CheckoutFailed';
import CheckoutCancelled from './components/CheckoutCancelled';

const devEnvironment = true;

function App() {
  const appConfig = new AppConfig();
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  // Get Authentication
  const auth = getAuth(app);
  // Get Storage
  const storage = getStorage(app);

  const [authEmulatorConnected, setAuthEmulatorConnected] = useState(false);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (appConfig.getIsDevEnvironment() == true) {
      if (!authEmulatorConnected) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        setAuthEmulatorConnected(true);
      }
    }
  }, [authEmulatorConnected]);

  // Initialize firestore class
  const firestore = new firestoredb(app, appConfig.getIsDevEnvironment());
  const cloudfirestore = new cloudFirestoreDb();

  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [userdata, setUserData] = useState(null);
  const [isadmin, setIsAdmin] = useState(false);
  const [favoriteitems, setFavoriteItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [refreshUser, setRefreshUser] = useState(false);
  const [userLoaded, setUserLoaded] = useState(null);
  const [deliveryaddress, setDeliveryAddress] = useState(null);
  const [contactPerson, setContactPerson] = useState([]);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [userstate, setUserState] = useState('guest');
  const [phonenumber, setPhoneNumber] = useState(null);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [guestLoginClicked, setGuestLoginClicked] = useState(false);
  const [products, setProducts] = useState([]);
  const [goToCheckoutPage, setGoToCheckoutPage] = useState(false);
  const [categories, setCategories] = useState(null);
  const [initialStartup, setInitialStartup] = useState(true);

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log('onAuthStateChanged ran');
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        console.log('FOUND USER', user.uid);
        setUserState('userloading');
        setUser(user);
        cloudfirestore.checkIfUserIdAlreadyExist(user.uid).then((userExists) => {
          console.log(userExists);
          if (userExists) {
            console.log('user exists');
            setUserId(user.uid);
          } else {
            console.log('user does not exist');

            async function createNewUser() {
              // "member": Represents a registered user with standard privileges, such as creating and editing their own content.
              // "moderator": Represents a user with additional privileges to manage and moderate content created by other users.
              // "admin": Represents an administrator with broad system access, including managing users, settings, and other high-level functions.
              // "superAdmin": Represents a super administrator with the highest level of access, able to manage all aspects of the system, including creating and managing other admin-level users.
              await cloudfirestore.createNewUser(
                {
                  uid: user.uid,
                  name: user.displayName,
                  email: user.email,
                  emailVerified: user.emailVerified,
                  phoneNumber: '',
                  deliveryAddress: [],
                  contactPerson: [],
                  isAnonymous: user.isAnonymous,
                  orders: [],
                  cart: [],
                  favoriteItems: [],
                  payments: [],
                  userRole: 'member',
                },
                user.uid
              );
            }
            console.log('creating new user');
            createNewUser();
            delay(1000).then(() => {
              setUserId(user.uid);
            });
          }
        });

        //
        // ...
      } else {
        // User is signed out
        // ...
        setUser(null);
        setUserId(null);
        setUserData(null);
        setUserLoaded(true);
        setUserState('guest');
      }
    });
  }, []);

  useEffect(() => {
    // GET ALL PRODUCTS
    async function readAllProductsForOnlineStore() {
      await cloudfirestore.readAllProductsForOnlineStore().then((products) => {
        setProducts(products);
      });
    }
    readAllProductsForOnlineStore();
  }, []);

  useEffect(() => {
    // FLOW FOR GUEST LOGIN
    async function setAllUserData() {
      const localStorageCart = JSON.parse(localStorage.getItem('cart'));
      if (userId) {
        console.log(userId);
        const data = await cloudfirestore.readSelectedUserById(userId);
        console.log(data);
        setUserData(data);
        setFavoriteItems(data.favoriteItems);

        if (guestLoginClicked === true) {
          setCart(localStorageCart);
          firestore.createUserCart(localStorageCart, userId).then(() => {
            localStorage.removeItem('cart');
            console.log('cart removed from local storage');
            setGuestLoginClicked(false);
            setGoToCheckoutPage(true);
          });
        }
        if (guestLoginClicked === false) {
          // console.log('guestLoginClicked is false');
          console.log('setting Cart');
          setCart(data.cart);
        }
        // FLOW FOR GUEST LOGIN
        // ADMIN CHECK
        const adminRoles = ['admin', 'superAdmin'];

        const userRole = await cloudfirestore.readUserRole(data.uid);
        if (adminRoles.includes(userRole)) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        // ADMIN CHECK

        setDeliveryAddress(data.deliveryAddress);
        setPhoneNumber(data.phoneNumber);
        setOrders(data.orders);
        setPayments(data.payments);
        setContactPerson(data.contactPerson);
        // LAST TO RUN
        setUserState('userloaded');
        setUserLoaded(true);
      }
    }
    setAllUserData();
  }, [userId, refreshUser]);

  useEffect(() => {
    if (goToCheckoutPage) {
      delay(2000).then(() => {
        navigateTo('/checkout');
        setGoToCheckoutPage(false);
      });
    }
  }, [goToCheckoutPage]);

  const appContextValue = {
    categories: categories,
    setCategories: setCategories,
    firebaseApp: app,
    user: user,
    userdata: userdata,
    setUserData: setUserData,
    isadmin: isadmin,
    firestore: firestore,
    cloudfirestore: cloudfirestore,
    cart: cart,
    setCart: setCart,
    favoriteitems: favoriteitems,
    setFavoriteItems: setFavoriteItems,
    userId: userId,
    setUserId: setUserId,
    refreshUser: refreshUser,
    setRefreshUser: setRefreshUser,
    userLoaded: userLoaded,
    setUserLoaded: setUserLoaded,
    deliveryaddress: deliveryaddress,
    setDeliveryAddress: setDeliveryAddress,
    latitude: latitude,
    setLatitude: setLatitude,
    longitude: longitude,
    setLongitude: setLongitude,
    userstate: userstate,
    setUserState: setUserState,
    phonenumber: phonenumber,
    setPhoneNumber: setPhoneNumber,
    orders: orders,
    setOrders: setOrders,
    payments: payments,
    setPayments: setPayments,
    contactPerson: contactPerson,
    setContactPerson: setContactPerson,
    auth: auth,
    setIsAdmin: setIsAdmin,
    setGuestLoginClicked: setGuestLoginClicked,
    products: products,
    setProducts: setProducts,
    goToCheckoutPage: goToCheckoutPage,
    setGoToCheckoutPage: setGoToCheckoutPage,
    storage:storage
  };

  return (
    <div id="app">
      <Routes>
        <Route
          path="/"
          element={
            <AppContext.Provider value={appContextValue}>
              <NavBar />
              <Shop />
            </AppContext.Provider>
          }
        />
        <Route
          path="/admin"
          element={
            <AppContext.Provider value={appContextValue}>
              <AdminSecurity />
            </AppContext.Provider>
          }
        />
        <Route
          path="/profile"
          element={
            <AppContext.Provider value={appContextValue}>
              <NavBar />
              <PersonalInfoForm />
            </AppContext.Provider>
          }
        />
        <Route
          path="/checkout"
          element={
            <AppContext.Provider value={appContextValue}>
              <NavBar />
              {userstate === 'userloading' || cart === [] ? (
                <div className="flex h-screen">
                  <div className="flex flex-col justify-center m-auto">
                    <div className="flex justify-center ">
                      <CircularProgress size="20vh" />
                    </div>
                    <div>
                      <Typography variant="h4" className="text-center">
                        Fetching data...
                      </Typography>
                    </div>
                  </div>
                </div>
              ) : (
                <CheckoutPage />
              )}
            </AppContext.Provider>
          }
        />
        <Route
          path="/myorders"
          element={
            <AppContext.Provider value={appContextValue}>
              <NavBar />
              {userstate === 'userloading' ? (
                <div className="flex h-screen">
                  <div className="flex flex-col justify-center m-auto">
                    <div className="flex justify-center ">
                      <CircularProgress size="20vh" />
                    </div>
                    <div>
                      <Typography variant="h4" className="text-center">
                        Fetching data...
                      </Typography>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <MyOrders />
                </div>
              )}
            </AppContext.Provider>
          }
        />
        <Route
          path="/accountstatement"
          element={
            <AppContext.Provider value={appContextValue}>
              <NavBar />
              {userstate === 'userloading' ? (
                <div className="flex h-screen">
                  <div className="flex flex-col justify-center m-auto">
                    <div className="flex justify-center ">
                      <CircularProgress size="20vh" />
                    </div>
                    <div>
                      <Typography variant="h4" className="text-center">
                        Fetching data...
                      </Typography>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <AccountStatement />
                </div>
              )}
            </AppContext.Provider>
          }
        />
        <Route
          path="/checkoutSuccess"
          element={
            <AppContext.Provider value={appContextValue}>
              <CheckoutSuccess />
            </AppContext.Provider>
          }
        />
        <Route
          path="/checkoutFailed"
          element={
            <AppContext.Provider value={appContextValue}>
              <CheckoutFailed />
            </AppContext.Provider>
          }
        />
        <Route
          path="/checkoutCancelled"
          element={
            <AppContext.Provider value={appContextValue}>
              <CheckoutCancelled />
            </AppContext.Provider>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
